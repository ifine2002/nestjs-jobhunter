import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { IUser } from 'src/common/interfaces/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private readonly subscriberModel: SoftDeleteModel<SubscriberDocument>
  ) {}
  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const { email } = createSubscriberDto;
    const subscriber = await this.subscriberModel.findOne({ email });
    if (subscriber) {
      throw new BadRequestException(`Subscriber with email = ${email} already exists`);
    }
    const newSubscriber = await this.subscriberModel.create({
      ...createSubscriberDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newSubscriber._id,
      createdAt: newSubscriber.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit ? limit : 10;
    const totalItems = (await this.subscriberModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    // if (isEmpty(sort)) {
    //   // @ts-ignore: Unreachable code error
    //   sort = '-updatedAt';
    // }

    const result = await this.subscriberModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`id is mongo id`);
    }
    const subscriber = await this.subscriberModel.findById(id);
    if (!subscriber) {
      throw new NotFoundException(`Subscriber with ID ${id} not found`);
    }
    return subscriber;
  }

  async update(id: string, updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
    const { email } = updateSubscriberDto;
    const subscriber = await this.findOne(id);
    const subscriberDB = await this.subscriberModel.findOne({
      email,
    });
    if (subscriberDB && subscriber.id !== subscriberDB.id) {
      throw new BadRequestException(`Subscriber with email = ${email} already exists`);
    }
    return await this.subscriberModel.updateOne(
      { _id: id },
      {
        ...updateSubscriberDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      }
    );
  }

  async remove(id: string, user: IUser) {
    await this.subscriberModel.updateOne(
      { _id: id },
      { deletedBy: { _id: user._id, email: user.email } }
    );
    return this.subscriberModel.softDelete({
      _id: id,
    });
  }
}
