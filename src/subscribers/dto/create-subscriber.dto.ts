import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsNotEmpty({ message: 'name must be not blank' })
  @IsEmail({}, { message: 'invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'name must be not blank' })
  name: string;

  @IsNotEmpty({ message: 'skills must be not blank' })
  @IsArray({ message: 'skills is formatted as array' })
  @IsString({ each: true, message: 'skill is formatted as string' })
  skills: string[];
}
