import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Department } from '../departments/department.entity.js';
import { Designation } from '../designations/designations.entity.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { Employee } from './employee.entity.js';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,

    @InjectRepository(Designation)
    private readonly designationRepository: Repository<Designation>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const { departmentId, designationId, ...employeeData } = createEmployeeDto;

    const department = await this.departmentRepository.findOneBy({
      id: departmentId,
    });

    if (!department) {
      throw new NotFoundException(
        `Department with ID ${departmentId} not found`,
      );
    }

    if (!department.isActive) {
      throw new BadRequestException('Cannot assign an inactive department');
    }

    const designation = await this.designationRepository.findOneBy({
      id: designationId,
    });

    if (!designation) {
      throw new NotFoundException(
        `Designation with ID ${designationId} not found`,
      );
    }

    if (!designation.isActive) {
      throw new BadRequestException('Cannot assign an inactive designation');
    }

    const employee = this.employeeRepository.create({
      ...employeeData,
      department,
      designation,
    });

    try {
      return await this.employeeRepository.save(employee);
    } catch (error: unknown) {
      this.handleDatabaseError(error);
    }
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({
      relations: {
        department: true,
        designation: true,
      },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: {
        department: true,
        designation: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findOne(id);

    const { departmentId, designationId, ...employeeData } = updateEmployeeDto;

    Object.assign(employee, employeeData);

    if (departmentId !== undefined) {
      const department = await this.departmentRepository.findOneBy({
        id: departmentId,
      });

      if (!department) {
        throw new NotFoundException(
          `Department with ID ${departmentId} not found`,
        );
      }

      if (!department.isActive) {
        throw new BadRequestException('Cannot assign an inactive department');
      }

      employee.department = department;
    }

    if (designationId !== undefined) {
      const designation = await this.designationRepository.findOneBy({
        id: designationId,
      });

      if (!designation) {
        throw new NotFoundException(
          `Designation with ID ${designationId} not found`,
        );
      }

      if (!designation.isActive) {
        throw new BadRequestException('Cannot assign an inactive designation');
      }

      employee.designation = designation;
    }

    try {
      return await this.employeeRepository.save(employee);
    } catch (error: unknown) {
      this.handleDatabaseError(error);
    }
  }

  async deactivate(id: number): Promise<Employee> {
    const employee = await this.findOne(id);

    employee.isActive = false;

    return this.employeeRepository.save(employee);
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
        'An employee with this employee code or email already exists',
      );
    }

    throw error;
  }
}
