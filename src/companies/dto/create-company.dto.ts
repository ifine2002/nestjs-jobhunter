import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'name must be not blank' })
  name: string;

  @IsNotEmpty({ message: 'address must be not blank' })
  address: string;

  @IsNotEmpty({ message: 'description must be not blank' })
  description: string;

  @IsNotEmpty({ message: 'logo must be not blank' })
  logo: string;
}
