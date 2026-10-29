import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Designation } from './designations.entity.js';
import { CreateDesignationDto } from './dto/create-designation.dto.js';
import { UpdateDesignationDto } from './dto/update-designation.dto.js';

@Injectable()
export class DesignationsService {
  constructor(
    @InjectRepository(Designation)
    private readonly designationRepository: Repository<Designation>,
  ) {}

  async create(
    createDesignationDto: CreateDesignationDto,
  ): Promise<Designation> {
    const designation = this.designationRepository.create(createDesignationDto);

    try {
      return await this.designationRepository.save(designation);
    } catch (error: unknown) {
      this.handleDatabaseError(error);
    }
  }

  async findAll(): Promise<Designation[]> {
    return this.designationRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Designation> {
    const designation = await this.designationRepository.findOneBy({ id });

    if (!designation) {
      throw new NotFoundException(`Designation with ID ${id} not found`);
    }

    return designation;
  }

  async update(
    id: number,
    updateDesignationDto: UpdateDesignationDto,
  ): Promise<Designation> {
    const designation = await this.findOne(id);

    Object.assign(designation, updateDesignationDto);

    try {
      return await this.designationRepository.save(designation);
    } catch (error: unknown) {
      this.handleDatabaseError(error);
    }
  }

  async deactivate(id: number): Promise<Designation> {
    const designation = await this.findOne(id);

    designation.isActive = false;

    return this.designationRepository.save(designation);
  }

  private handleDatabaseError(error: unknown): never {
    if (
      error instanceof QueryFailedError &&
      (
        error as QueryFailedError & {
          driverError?: { code?: string };
        }
      ).driverError?.code === '23505'
    ) {
      throw new ConflictException(
        'A designation with this code or title already exists',
      );
    }

    throw error;
  }
}
