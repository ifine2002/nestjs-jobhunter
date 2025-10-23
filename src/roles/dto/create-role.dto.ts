import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'name must be not blank' })
  name: string;

  @IsNotEmpty({ message: 'description must be not blank' })
  description: string;

  @IsNotEmpty({ message: 'isActive must be not blank' })
  @IsBoolean({ message: 'isActice is formatted as boolean' })
  isActive: string;

  @IsNotEmpty({ message: 'permissions must be not blank' })
  @IsMongoId({ each: true, message: 'each permission is mongo object id' })
  @IsArray({ message: 'permissions is formatted as array' })
  permissions: mongoose.Schema.Types.ObjectId[];
}
