import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/common/interfaces/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: SoftDeleteModel<PermissionDocument>
  ) {}
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { apiPath, method } = createPermissionDto;
    const permission = await this.permissionModel.findOne({
      apiPath,
      method,
    });
    if (permission) {
      throw new BadRequestException(
        `Permission with apiPath=${apiPath} and method=${method} already exists`
      );
    }
    const newPermission = await this.permissionModel.create({
      ...createPermissionDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newPermission.id,
      createdAt: newPermission.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit ? limit : 10;
    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    // if (isEmpty(sort)) {
    //   // @ts-ignore: Unreachable code error
    //   sort = '-updatedAt';
    // }

    const result = await this.permissionModel
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
    const permission = await this.permissionModel.findById(id);
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    return permission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    const { apiPath, method } = updatePermissionDto;
    const permission = await this.findOne(id);
    const permissionDB = await this.permissionModel.findOne({
      apiPath,
      method,
    });
    if (permission.id !== permissionDB.id) {
      throw new BadRequestException(
        `Permission with apiPath=${apiPath} and method=${method} already exists`
      );
    }
    return await this.permissionModel.updateOne(
      { _id: id },
      {
        ...updatePermissionDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      }
    );
  }

  async remove(id: string, user: IUser) {
    await this.findOne(id);
    await this.permissionModel.updateOne(
      { _id: id },
      { deletedBy: { _id: user._id, email: user.email } }
    );
    return this.permissionModel.softDelete({
      _id: id,
    });
  }
}
