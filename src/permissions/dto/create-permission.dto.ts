import { IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'name must be not blank' })
  name: string;

  @IsNotEmpty({ message: 'apiPath must be not blank' })
  apiPath: string;

  @IsNotEmpty({ message: 'method must be not blank' })
  method: string;

  @IsNotEmpty({ message: 'module must be not blank' })
  module: string;
}
