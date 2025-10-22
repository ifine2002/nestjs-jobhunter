import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public, ResponseMessage, User } from 'src/common/decorators/customize';
import { IUser } from 'src/common/interfaces/users.interface';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @ResponseMessage('Create a company')
  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return await this.companiesService.create(createCompanyDto, user);
  }

  @Public()
  @ResponseMessage('Fetch all companies success!')
  @Get()
  async findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string
  ) {
    return await this.companiesService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @ResponseMessage('Get a company by id')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.companiesService.findOne(id);
  }

  @ResponseMessage('Update a company by id')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser
  ) {
    return await this.companiesService.update(id, updateCompanyDto, user);
  }

  @ResponseMessage('Delete a company')
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.companiesService.remove(id, user);
  }
}
