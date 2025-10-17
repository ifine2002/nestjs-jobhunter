import { IsEmail, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
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
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'name must be not blank' })
  name: string;

  @IsNotEmpty({ message: 'email must be not blank' })
  @IsEmail({}, { message: 'invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'password must be not blank' })
  password: string;

  @IsNotEmpty({ message: 'confirmPassword must be not blank' })
  confirmPassword: string;
}
