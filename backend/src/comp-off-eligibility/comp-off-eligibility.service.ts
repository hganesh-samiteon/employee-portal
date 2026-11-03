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
}
