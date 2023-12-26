import { CreateChargeDto } from '@app/common';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  /**
   * We are not allowed to pass a plain class to the validation we need to pass a type that it knows about it
   * so for that we use the "@Type" decorator from "class-transformer
   * this will create a new instance of the class and then validate it with the class-validator this is how to handle nested objects validation
   */
  @Type(() => CreateChargeDto)
  charge: CreateChargeDto;
}
