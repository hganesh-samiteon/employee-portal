import { PartialType } from '@nestjs/mapped-types';
import { CreateLeavePolicyConfigurationDto } from './create-leave-policy-configuration.dto.js';

export class UpdateLeavePolicyConfigurationDto extends PartialType(
  CreateLeavePolicyConfigurationDto,
) {}
