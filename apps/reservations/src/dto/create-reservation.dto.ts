import { CreateChargeDto } from '@app/common';
import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';

@InputType()
export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  @Field()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @Field()
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
  // graphql related
  @Field(() => CreateChargeDto)
  charge: CreateChargeDto;
}
