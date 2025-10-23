import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { IUser } from 'src/common/interfaces/users.interface';
import aqp from 'api-query-params';
import { ConfigService } from '@nestjs/config';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private readonly roleModel: SoftDeleteModel<RoleDocument>,
    private configService: ConfigService
  ) {}

  getHashPassword = (plainText: string) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainText, salt);
  };

  async create(createUserDto: CreateUserDto, user: IUser) {
    const { name, email, password, age, gender, address, role, company } = createUserDto;

    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException('Email already exists');
    }
    const hashPassword = this.getHashPassword(password);
    return await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role,
      company,
      createdBy: {
        _id: user?._id,
        email: user?.email,
      },
    });
  }

  async register(registerUserDto: RegisterUserDto) {
    const { name, email, password, age, gender, address } = registerUserDto;

    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException('Email already exists');
    }

    //fetch user role
    const roleName = this.configService.get<string>('NORMAL_USER');
    const roleUser = await this.roleModel.findOne({ name: roleName });

    const hashPassword = this.getHashPassword(password);
    return await this.userModel.create({
      name: name,
      email: email,
      password: hashPassword,
      age: age,
      gender: gender,
      address: address,
      role: roleUser?._id,
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.page;
    delete filter.current;
    delete filter.pageSize;
    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit ? limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    // if (isEmpty(sort)) {
    //   // @ts-ignore: Unreachable code error
    //   sort = '-updatedAt';
    // }

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .select('-password')
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
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

    const user = (await this.userModel.findById(id).select('-password')).populate({
      path: 'role',
      select: { name: 1 },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByUsername(username: string) {
    return await this.userModel
      .findOne({
        email: username,
      })
      .populate({ path: 'role', select: { name: 1 } });
  }

  isValidPassword(password: string, hashPassword: string) {
    return bcrypt.compareSync(password, hashPassword);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    await this.findOne(updateUserDto._id);
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto, updatedBy: { _id: user._id, email: user.email } }
    );
  }

  async remove(id: string, user: IUser) {
    const userDB = await this.findOne(id);
    const emailAdmin = this.configService.get<string>('EMAIL_ADMIN');
    if (userDB.email === emailAdmin) {
      throw new BadRequestException(`Cannot delete admin account`);
    }
    await this.userModel.updateOne(
      { _id: id },
      { deletedBy: { _id: user._id, email: user.email } }
    );
    return this.userModel.softDelete({
      _id: id,
    });
  }

  updateRefreshToken = async (refreshToken: string, _id: string) => {
    await this.userModel.updateOne({ _id: _id }, { refreshToken });
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel
      .findOne({ refreshToken })
      .populate({ path: 'role', select: { name: 1 } });
  };
}
