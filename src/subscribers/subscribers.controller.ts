import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { ResponseMessage, SkipCheckPermission, User } from 'src/common/decorators/customize';
import { IUser } from 'src/common/interfaces/users.interface';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @ResponseMessage('Create a new subscriber')
  @Post()
  async create(@Body() createSubscriberDto: CreateSubscriberDto, @User() user: IUser) {
    return await this.subscribersService.create(createSubscriberDto, user);
  }

  @ResponseMessage(`Get subscriber's skills`)
  @SkipCheckPermission()
  @Post('skills')
  async getUserSkills(@User() user: IUser) {
    return await this.subscribersService.getSkills(user);
  }

  @ResponseMessage('Fetch all subscriber with paginate')
  @Get()
  async findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string
  ) {
    return await this.subscribersService.findAll(+currentPage, +pageSize, qs);
  }

  @ResponseMessage('Get a subscriber by id')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.subscribersService.findOne(id);
  }

  @ResponseMessage('Update a subscriber')
  @SkipCheckPermission()
  @Patch()
  async update(@Body() updateSubscriberDto: UpdateSubscriberDto, @User() user: IUser) {
    return await this.subscribersService.update(updateSubscriberDto, user);
  }

  @ResponseMessage('Delete a subscriber')
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.subscribersService.remove(id, user);
  }
}
