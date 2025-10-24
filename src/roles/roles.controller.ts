import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, User } from 'src/common/decorators/customize';
import { IUser } from 'src/common/interfaces/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ResponseMessage('Create a new role')
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return await this.rolesService.create(createRoleDto, user);
  }

  @ResponseMessage('Fetch all role with paginate')
  @Get()
  async findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string
  ) {
    return await this.rolesService.findAll(+currentPage, +pageSize, qs);
  }

  @ResponseMessage('Get a role by id')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.rolesService.findOne(id);
  }

  @ResponseMessage('Update a role')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUser) {
    return await this.rolesService.update(id, updateRoleDto, user);
  }

  @ResponseMessage('Delete a role')
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.rolesService.remove(id, user);
  }
}
