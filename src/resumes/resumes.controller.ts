import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/common/decorators/customize';
import { IUser } from 'src/common/interfaces/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @ResponseMessage('Create a new resume')
  @Post()
  async create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
    return await this.resumesService.create(createResumeDto, user);
  }

  @ResponseMessage('Fetch all resume (with paginate)')
  @Get()
  async findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string
  ) {
    return await this.resumesService.findAll(+currentPage, +pageSize, qs);
  }

  @ResponseMessage('Get a resume by id')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.resumesService.findOne(id);
  }

  @ResponseMessage('Change status a resume')
  @Patch(':id')
  async update(@Param('id') id: string, @Body('status') status: string, @User() user: IUser) {
    return await this.resumesService.update(id, status, user);
  }

  @ResponseMessage('Delete a resume')
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.resumesService.remove(id, user);
  }

  @ResponseMessage('Get resume by user')
  @Post('by-user')
  async getResumeByUser(@User() user: IUser) {
    return await this.resumesService.findByUsers(user);
  }
}
