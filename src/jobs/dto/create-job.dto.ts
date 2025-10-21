import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty({ message: '_id must be not blank' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'name must be not blank' })
  name: string;

  @IsNotEmpty({ message: 'logo must be not blank' })
  logo: string;
}

export class CreateJobDto {
  @IsNotEmpty({ message: 'name must be not blank' })
  name: string;

  @IsNotEmpty({ message: 'skills must be not blank' })
  @IsArray({ message: 'skills are formatted as arrays' })
  @IsString({ each: true, message: 'skill is formatted as string' })
  skills: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty({ message: 'location must be not blank' })
  location: string;

  @IsNotEmpty({ message: 'salary must be not blank' })
  salary: number;

  @IsNotEmpty({ message: 'quantity must be not blank' })
  quantity: number;

  @IsNotEmpty({ message: 'level must be not blank' })
  level: string;

  @IsNotEmpty({ message: 'description must be not blank' })
  description: string;

  @IsNotEmpty({ message: 'startDate must be not blank' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'startDate is formatted as date' })
  startDate: Date;

  @IsNotEmpty({ message: 'endDate must be not blank' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'startDate is formatted as date' })
  endDate: Date;

  @IsNotEmpty({ message: 'isActive must be not blank' })
  @IsBoolean({ message: 'isActive is formatted as boolean' })
  isActive: boolean;
}
