import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

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
  role: string;

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
