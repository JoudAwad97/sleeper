import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class CreateUserDto {
  @IsEmail()
  @Field()
  email: string;

  @IsStrongPassword()
  @Field()
  password: string;

  @IsOptional()
  @IsArray()
  @IsString()
  @IsNotEmpty()
  @Field(() => [String], { nullable: true })
  roles?: string[];
}
