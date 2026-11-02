import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LeavePolicyConfiguration } from './leave-policy-configuration.entity.js';
import { CreateLeavePolicyConfigurationDto } from './dto/create-leave-policy-configuration.dto.js';

import { LeaveType } from '../leave-types/leave-type.entity.js';
import { Department } from '../departments/department.entity.js';
import { Designation } from '../designations/designations.entity.js';

import { AllocationMode } from './enums/allocation-mode.enum.js';

@Injectable()
export class LeavePolicyConfigurationsService {
  constructor(
    @InjectRepository(LeavePolicyConfiguration)
    private readonly policyRepository: Repository<LeavePolicyConfiguration>,

    @InjectRepository(LeaveType)
    private readonly leaveTypeRepository: Repository<LeaveType>,

    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,

    @InjectRepository(Designation)
    private readonly designationRepository: Repository<Designation>,
  ) {}

  async create(
    dto: CreateLeavePolicyConfigurationDto,
  ): Promise<LeavePolicyConfiguration> {
    const leaveType = await this.leaveTypeRepository.findOne({
      where: { id: dto.leaveTypeId, isActive: true },
    });

    if (!leaveType) {
      throw new NotFoundException('Active leave type not found');
    }

    const department = dto.departmentId
      ? await this.departmentRepository.findOne({
          where: { id: dto.departmentId, isActive: true },
        })
      : null;

    if (dto.departmentId && !department) {
      throw new NotFoundException('Active department not found');
    }

    const designation = dto.designationId
      ? await this.designationRepository.findOne({
          where: { id: dto.designationId, isActive: true },
        })
      : null;

    if (dto.designationId && !designation) {
      throw new NotFoundException('Active designation not found');
    }

    this.validatePolicyDates(dto);
    this.validateAllocation(dto);

    await this.ensureNoOverlap(dto);

    const latestVersion = await this.policyRepository
      .createQueryBuilder('policy')
      .where('policy.leave_type_id = :leaveTypeId', {
        leaveTypeId: dto.leaveTypeId,
      })
      .andWhere('policy.policyYear = :policyYear', {
        policyYear: dto.policyYear,
      })
      .andWhere('policy.department_id IS NOT DISTINCT FROM :departmentId', {
        departmentId: dto.departmentId ?? null,
      })
      .andWhere('policy.designation_id IS NOT DISTINCT FROM :designationId', {
        designationId: dto.designationId ?? null,
      })
      .orderBy('policy.version', 'DESC')
      .getOne();

    const configuration = this.policyRepository.create({
      leaveType,
      department,
      designation,
      policyYear: dto.policyYear,
      version: (latestVersion?.version ?? 0) + 1,
      effectiveFrom: dto.effectiveFrom,
      effectiveTo: dto.effectiveTo ?? null,
      entitlementValue: dto.entitlementValue?.toFixed(2) ?? null,
      entitlementUnit: dto.entitlementUnit ?? null,
      allocationMode: dto.allocationMode,
      proRataMethod: dto.proRataMethod ?? null,
      accrualValue: dto.accrualValue?.toFixed(2) ?? null,
      accrualUnit: dto.accrualUnit ?? null,
      accrualBasisValue: dto.accrualBasisValue?.toFixed(2) ?? null,
      accrualBasisUnit: dto.accrualBasisUnit ?? null,
      allowHalfDay: dto.allowHalfDay ?? false,
      carryForwardAllowed: dto.carryForwardAllowed ?? false,
      maxCarryForward: dto.maxCarryForward?.toFixed(2) ?? null,
    });

    return this.policyRepository.save(configuration);
  }

  async findAll(): Promise<LeavePolicyConfiguration[]> {
    return this.policyRepository.find({
      relations: {
        leaveType: true,
        department: true,
        designation: true,
      },
      order: {
        policyYear: 'DESC',
        version: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<LeavePolicyConfiguration> {
    const configuration = await this.policyRepository.findOne({
      where: { id },
      relations: {
        leaveType: true,
        department: true,
        designation: true,
      },
    });

    if (!configuration) {
      throw new NotFoundException(
        `Leave policy configuration with ID ${id} not found`,
      );
    }

    return configuration;
  }

  private validatePolicyDates(dto: CreateLeavePolicyConfigurationDto): void {
    const from = new Date(`${dto.effectiveFrom}T00:00:00`);
    const to = dto.effectiveTo ? new Date(`${dto.effectiveTo}T00:00:00`) : null;

    const yearStart = new Date(dto.policyYear, 0, 1);
    const yearEnd = new Date(dto.policyYear, 11, 31);

    if (to && to < from) {
      throw new BadRequestException(
        'Effective end date cannot be before start date',
      );
    }

    if (from < yearStart || from > yearEnd) {
      throw new BadRequestException(
        'Effective start date must fall within the policy year',
      );
    }

    if (to && to > yearEnd) {
      throw new BadRequestException(
        'Effective end date cannot exceed the policy year',
      );
    }
  }

  private validateAllocation(dto: CreateLeavePolicyConfigurationDto): void {
    if (
      dto.allocationMode === AllocationMode.ANNUAL ||
      dto.allocationMode === AllocationMode.FIXED ||
      dto.allocationMode === AllocationMode.PRO_RATA
    ) {
      if (dto.entitlementValue === undefined || !dto.entitlementUnit) {
        throw new BadRequestException(
          'Entitlement value and unit are required for this allocation mode',
        );
      }
    }

    if (dto.allocationMode === AllocationMode.PRO_RATA) {
      if (!dto.proRataMethod) {
        throw new BadRequestException(
          'Pro-rata method is required for pro-rata allocation',
        );
      }
    }

    if (dto.allocationMode === AllocationMode.WORKING_DAYS) {
      if (
        !dto.accrualValue ||
        !dto.accrualUnit ||
        !dto.accrualBasisValue ||
        !dto.accrualBasisUnit
      ) {
        throw new BadRequestException(
          'Accrual value, unit, basis value and basis unit are required for working-days allocation',
        );
      }
    }

    if (
      dto.carryForwardAllowed === false &&
      dto.maxCarryForward !== undefined
    ) {
      throw new BadRequestException(
        'Maximum carry-forward cannot be set when carry-forward is disabled',
      );
    }
  }

  private async ensureNoOverlap(
    dto: CreateLeavePolicyConfigurationDto,
  ): Promise<void> {
    const query = this.policyRepository
      .createQueryBuilder('policy')
      .where('policy.leave_type_id = :leaveTypeId', {
        leaveTypeId: dto.leaveTypeId,
      })
      .andWhere('policy.policyYear = :policyYear', {
        policyYear: dto.policyYear,
      })
      .andWhere('policy.is_active = true')
      .andWhere('policy.department_id IS NOT DISTINCT FROM :departmentId', {
        departmentId: dto.departmentId ?? null,
      })
      .andWhere('policy.designation_id IS NOT DISTINCT FROM :designationId', {
        designationId: dto.designationId ?? null,
      });

    const newStart = dto.effectiveFrom;
    const newEnd = dto.effectiveTo ?? `${dto.policyYear}-12-31`;

    query.andWhere(
      `policy.effective_from <= :newEnd
       AND COALESCE(policy.effective_to, :yearEnd) >= :newStart`,
      {
        newStart,
        newEnd,
        yearEnd: `${dto.policyYear}-12-31`,
      },
    );

    const overlapping = await query.getOne();

    if (overlapping) {
      throw new ConflictException(
        'An active policy configuration already exists for this leave type and scope during the requested dates',
      );
    }
  }
}
