import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { RegisterDto } from './dtos/register.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) { }

  /**
   * creat new user
   * @param registerDto data for creating new user
   * @returns JWT (access token)
   */

  getAllUsers() {
    return this.usersRepository.find();
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async register(dto: RegisterDto) {
    const { email, password, username } = dto
    const userFromDb = await this.usersRepository.findOne({ where: { email } })
    if (userFromDb) throw new BadRequestException("user already exist")
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)


    let user = this.usersRepository.create({email,password:hashPassword,username});
    user=await this.usersRepository.save(user);
    return user
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    const user = await this.getUserById(id);
    if (dto.username != null) user.username = dto.username;
    if (dto.email != null) user.email = dto.email;
    if (dto.password != null) user.password = dto.password;
    return this.usersRepository.save(user);
  }

  async deleteUser(id: number) {
    const user = await this.getUserById(id);
    await this.usersRepository.remove(user);
    return { message: 'User deleted successfully' };
  }
}
