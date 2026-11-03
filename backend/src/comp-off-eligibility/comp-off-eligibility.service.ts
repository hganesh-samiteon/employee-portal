import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CompOffEligibility } from './comp-off-eligibility.entity.js';
import { Department } from '../departments/department.entity.js';
import { Designation } from '../designations/designations.entity.js';
import { CreateCompOffEligibilityDto } from './dto/create-comp-off-eligibility.dto.js';
import { UpdateCompOffEligibilityDto } from './dto/update-comp-off-eligibility.dto.js';

@Injectable()
export class CompOffEligibilityService {
  constructor(
    @InjectRepository(CompOffEligibility)
    private readonly compOffEligibilityRepository: Repository<CompOffEligibility>,

    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,

    @InjectRepository(Designation)
    private readonly designationRepository: Repository<Designation>,
  ) {}

  private validateEffectiveDates(
    effectiveFrom: string,
    effectiveTo?: string | null,
  ): void {
    if (effectiveTo && new Date(effectiveTo) < new Date(effectiveFrom)) {
      throw new BadRequestException(
        'Effective To date cannot be earlier than Effective From date',
      );
    }
  }

  private async validateNoOverlappingRule(
    departmentId: number | null,
    designationId: number | null,
    effectiveFrom: string,
    effectiveTo?: string | null,
    excludeId?: number,
  ): Promise<void> {
    const query = this.compOffEligibilityRepository
      .createQueryBuilder('rule')
      .where('rule.isActive = :isActive', { isActive: true })
      .andWhere('rule.department_id IS NOT DISTINCT FROM :departmentId', {
        departmentId,
      })
      .andWhere('rule.designation_id IS NOT DISTINCT FROM :designationId', {
        designationId,
      });

    if (excludeId) {
      query.andWhere('rule.id != :excludeId', { excludeId });
    }

    query.andWhere(
      `rule.effective_from <= COALESCE(:effectiveTo, 'infinity'::date)
     AND COALESCE(rule.effective_to, 'infinity'::date) >= :effectiveFrom`,
      {
        effectiveFrom,
        effectiveTo: effectiveTo ?? null,
      },
    );

    const existingRule = await query.getOne();

    if (existingRule) {
      throw new ConflictException(
        'An active eligibility rule already exists for this scope during the specified date range',
      );
    }
  }

  async create(dto: CreateCompOffEligibilityDto) {
    const {
      departmentId,
      designationId,
      isEligible,
      effectiveFrom,
      effectiveTo,
    } = dto;

    this.validateEffectiveDates(effectiveFrom, effectiveTo);

    let department: Department | null = null;
    let designation: Designation | null = null;

    if (departmentId !== undefined) {
      department = await this.departmentRepository.findOne({
        where: { id: departmentId, isActive: true },
      });

      if (!department) {
        throw new NotFoundException(
          `Active department with ID ${departmentId} not found`,
        );
      }
    }

    if (designationId !== undefined) {
      designation = await this.designationRepository.findOne({
        where: { id: designationId, isActive: true },
      });

      if (!designation) {
        throw new NotFoundException(
          `Active designation with ID ${designationId} not found`,
        );
      }
    }

    await this.validateNoOverlappingRule(
      departmentId ?? null,
      designationId ?? null,
      effectiveFrom,
      effectiveTo,
    );

    const rule = this.compOffEligibilityRepository.create({
      department,
      designation,
      isEligible,
      effectiveFrom,
      effectiveTo: effectiveTo ?? null,
      isActive: true,
    });

    return this.compOffEligibilityRepository.save(rule);
  }

  async findAll() {
    return this.compOffEligibilityRepository.find({
      relations: {
        department: true,
        designation: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const rule = await this.compOffEligibilityRepository.findOne({
      where: { id },
      relations: {
        department: true,
        designation: true,
      },
    });

    if (!rule) {
      throw new NotFoundException(
        `Comp-Off eligibility rule with ID ${id} not found`,
      );
    }

    return rule;
  }

  async update(id: number, dto: UpdateCompOffEligibilityDto) {
    // 1. Find the existing rule
    const rule = await this.findOne(id);

    // 2. Determine the updated scope
    const departmentId =
      dto.departmentId !== undefined
        ? dto.departmentId
        : (rule.department?.id ?? null);

    const designationId =
      dto.designationId !== undefined
        ? dto.designationId
        : (rule.designation?.id ?? null);

    // 3. Determine the updated dates
    const effectiveFrom = dto.effectiveFrom ?? rule.effectiveFrom;

    const effectiveTo =
      dto.effectiveTo !== undefined ? dto.effectiveTo : rule.effectiveTo;

    // 4. Validate the effective dates
    this.validateEffectiveDates(effectiveFrom, effectiveTo);

    // 5. Validate department
    if (departmentId !== null) {
      const department = await this.departmentRepository.findOne({
        where: { id: departmentId, isActive: true },
      });

      if (!department) {
        throw new NotFoundException(
          `Active department with ID ${departmentId} not found`,
        );
      }

      rule.department = department;
    } else {
      rule.department = null;
    }

    // 6. Validate designation
    if (designationId !== null) {
      const designation = await this.designationRepository.findOne({
        where: { id: designationId, isActive: true },
      });

      if (!designation) {
        throw new NotFoundException(
          `Active designation with ID ${designationId} not found`,
        );
      }

      rule.designation = designation;
    } else {
      rule.designation = null;
    }

    // 7. Check for overlapping rules
    await this.validateNoOverlappingRule(
      departmentId,
      designationId,
      effectiveFrom,
      effectiveTo,
      id,
    );

    // 8. Update supplied fields
    if (dto.isEligible !== undefined) {
      rule.isEligible = dto.isEligible;
    }

    rule.effectiveFrom = effectiveFrom;
    rule.effectiveTo = effectiveTo;

    // 9. Save updated rule
    return this.compOffEligibilityRepository.save(rule);
  }

  async deactivate(id: number) {
    const rule = await this.findOne(id);

    if (!rule.isActive) {
      throw new ConflictException(
        'Comp-Off eligibility rule is already deactivated',
      );
    }

    rule.isActive = false;

    return this.compOffEligibilityRepository.save(rule);
  }
}
