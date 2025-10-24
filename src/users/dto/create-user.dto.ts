import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

class Company {
  @IsNotEmpty({ message: '_id must be not blank' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'name must be not blank' })
  name: string;
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'name must be not blank' })
  name: string;

  @IsNotEmpty({ message: 'email must be not blank' })
  @IsEmail({}, { message: 'invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'password must be not blank' })
  password: string;

  @IsNotEmpty({ message: 'age must be not blank' })
  age: string;

  @IsNotEmpty({ message: 'gender must be not blank' })
  gender: string;

  @IsNotEmpty({ message: 'address must be not blank' })
  address: string;

  @IsNotEmpty({ message: 'role must be not blank' })
  @IsMongoId({ message: 'role is formatted as mongo id' })
  role: mongoose.Schema.Types.ObjectId;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'name must be not blank' })
  name: string;

  @IsNotEmpty({ message: 'email must be not blank' })
  @IsEmail({}, { message: 'invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'password must be not blank' })
  password: string;

  @IsNotEmpty({ message: 'age must be not blank' })
  age: string;

  @IsNotEmpty({ message: 'gender must be not blank' })
  gender: string;

  @IsNotEmpty({ message: 'address must be not blank' })
  address: string;
}

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'user', description: 'username' })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: 'password',
  })
  readonly password: string;
}
