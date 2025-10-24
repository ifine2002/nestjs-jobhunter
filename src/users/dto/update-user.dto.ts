import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) {
  // @IsNotEmpty({ message: '_id must be not blank' })
  // _id: string;
}
