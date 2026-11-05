import { IsNotEmpty, IsString, MaxLength, ValidateIf } from 'class-validator';
import { IsIn } from 'class-validator';

import { LeaveRequestStatus } from '../enums/leave-request-status.enum.js';

export class ReviewLeaveRequestDto {
  @IsIn([LeaveRequestStatus.APPROVED, LeaveRequestStatus.REJECTED])
  status: LeaveRequestStatus.APPROVED | LeaveRequestStatus.REJECTED;

  @ValidateIf((o) => o.status === LeaveRequestStatus.REJECTED)
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  rejectionReason?: string;
}
