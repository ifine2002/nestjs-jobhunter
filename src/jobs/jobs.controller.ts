import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from 'src/common/decorators/customize';
import { IUser } from 'src/common/interfaces/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ResponseMessage('Create a new job')
  @Post()
  async create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    const job = await this.jobsService.create(createJobDto, user);
    return {
      _id: job?._id,
      createdAt: job?.createdAt,
    };
  }

  @Public()
  @ResponseMessage('Fetch job with paginate')
  @Get()
  async findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string
  ) {
    return await this.jobsService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @ResponseMessage('Fetch job by id')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.jobsService.findOne(id);
  }

  @ResponseMessage('Update a job')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @User() user: IUser) {
    return await this.jobsService.update(id, updateJobDto, user);
  }

  @ResponseMessage('Delete a job')
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.jobsService.remove(id, user);
  }
}
