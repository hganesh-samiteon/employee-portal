import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Holiday } from './holiday.entity.js';
import { CreateHolidayDto } from './dto/create-holiday.dto.js';
import { UpdateHolidayDto } from './dto/update-holiday.dto.js';

@Injectable()
export class HolidaysService {
  constructor(
    @InjectRepository(Holiday)
    private readonly holidayRepository: Repository<Holiday>,
  ) {}

  async create(createHolidayDto: CreateHolidayDto): Promise<Holiday> {
    const { name, date, description, category, region } = createHolidayDto;

    await this.ensureNoDuplicate(date, category, region ?? null);

    const holiday = this.holidayRepository.create({
      name,
      date,
      description: description ?? null,
      category,
      region: region ?? null,
    });

    return this.holidayRepository.save(holiday);
  }

  async findAll(): Promise<Holiday[]> {
    return this.holidayRepository.find({
      order: {
        date: 'ASC',
        id: 'ASC',
      },
    });
  }

  async findByDate(date: string): Promise<Holiday[]> {
    return this.holidayRepository.find({
      where: { date, isActive: true },
      order: { id: 'ASC' },
    });
  }
  async findOne(id: number): Promise<Holiday> {
    const holiday = await this.holidayRepository.findOne({
      where: { id },
    });

    if (!holiday) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }

    return holiday;
  }

  async update(
    id: number,
    updateHolidayDto: UpdateHolidayDto,
  ): Promise<Holiday> {
    const holiday = await this.findOne(id);
    const nextDate = updateHolidayDto.date ?? holiday.date;
    const nextCategory = updateHolidayDto.category ?? holiday.category;
    const nextRegion =
      updateHolidayDto.region !== undefined
        ? updateHolidayDto.region
        : holiday.region;

    await this.ensureNoDuplicate(
      nextDate,
      nextCategory,
      nextRegion ?? null,
      id,
    );

    Object.assign(holiday, updateHolidayDto);

    return this.holidayRepository.save(holiday);
  }

  async deactivate(id: number): Promise<Holiday> {
    const holiday = await this.findOne(id);

    holiday.isActive = false;

    return this.holidayRepository.save(holiday);
  }

  private async ensureNoDuplicate(
    date: string,
    category: 'PUBLIC' | 'COMPANY',
    region: string | null,
    excludeId?: number,
  ): Promise<void> {
    const query = this.holidayRepository
      .createQueryBuilder('holiday')
      .where('holiday.date = :date', { date })
      .andWhere('holiday.category = :category', { category })
      .andWhere('holiday.isActive = :isActive', { isActive: true });

    if (region === null) {
      query.andWhere('holiday.region IS NULL');
    } else {
      query.andWhere('holiday.region = :region', { region });
    }

    if (excludeId !== undefined) {
      query.andWhere('holiday.id != :excludeId', { excludeId });
    }

    const existingHoliday = await query.getOne();

    if (existingHoliday) {
      throw new ConflictException(
        'An active holiday with the same date, category, and region already exists',
      );
    }
  }
}
