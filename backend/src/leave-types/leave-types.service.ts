import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { LeaveType } from './leave-type.entity.js';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto.js';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto.js';

@Injectable()
export class LeaveTypesService {
  constructor(
    @InjectRepository(LeaveType)
    private readonly leaveTypeRepository: Repository<LeaveType>,
  ) {}

  async create(createLeaveTypeDto: CreateLeaveTypeDto): Promise<LeaveType> {
    const { code, name } = createLeaveTypeDto;

    const existingLeaveType = await this.leaveTypeRepository.findOne({
      where: [{ code }, { name }],
    });

    if (existingLeaveType) {
      throw new ConflictException(
        'A leave type with this code or name already exists',
      );
    }

    const leaveType = this.leaveTypeRepository.create(createLeaveTypeDto);

    return this.leaveTypeRepository.save(leaveType);
  }

  async findAll(): Promise<LeaveType[]> {
    return this.leaveTypeRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<LeaveType> {
    const leaveType = await this.leaveTypeRepository.findOne({
      where: { id },
    });

    if (!leaveType) {
      throw new NotFoundException(`Leave type with ID ${id} not found`);
    }

    return leaveType;
  }

  async update(
    id: number,
    updateLeaveTypeDto: UpdateLeaveTypeDto,
  ): Promise<LeaveType> {
    const leaveType = await this.findOne(id);

    const { code, name } = updateLeaveTypeDto;

    if (code || name) {
      const existingLeaveType = await this.leaveTypeRepository
        .createQueryBuilder('leaveType')
        .where('(leaveType.code = :code OR leaveType.name = :name)', {
          code: code ?? leaveType.code,
          name: name ?? leaveType.name,
        })
        .andWhere('leaveType.id != :id', { id })
        .getOne();

      if (existingLeaveType) {
        throw new ConflictException(
          'A leave type with this code or name already exists',
        );
      }
    }

    Object.assign(leaveType, updateLeaveTypeDto);

    return this.leaveTypeRepository.save(leaveType);
  }

  async deactivate(id: number): Promise<LeaveType> {
    const leaveType = await this.findOne(id);

    if (!leaveType.isActive) {
      throw new ConflictException('Leave type is already inactive');
    }

    leaveType.isActive = false;

    return this.leaveTypeRepository.save(leaveType);
  }
}
