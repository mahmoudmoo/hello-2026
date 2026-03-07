import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { RegisterDto } from './dtos/register.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, AccessToken } from 'src/utils/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,

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
  /**
    * register 
    * @param registerDto Data for register new user 
    * @returns JWT (access token)
    */
  async register(dto: RegisterDto): Promise<{ user: UserEntity, token: AccessToken }> {
    const { email, password, username } = dto
    const userFromDb = await this.usersRepository.findOne({ where: { email } })
    if (userFromDb) throw new BadRequestException("user already exist")
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    let user = this.usersRepository.create({ email, password: hashPassword, username });
    

    const token = await this.generateJwtToken({ id: user.id, email: user.email });
    
    user = await this.usersRepository.save(user);
    return { user, token }
  }

  /**
   * login 
   * @param LoginDto Data for login to user acccount 
   * @returns JWT (access token)
   */
  async login(dto: LoginDto): Promise<{ user: UserEntity, token: AccessToken }> {
    const { email, password } = dto;
    const user = await this.usersRepository.findOne({ where: { email } })
    if (!user) throw new BadRequestException("invalid email or password")
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new BadRequestException("invalid email or password");
    
    const token = await this.generateJwtToken({ id: user.id, email: user.email });
    return { user, token };
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

  /**
   * generate JWT token
   * @param payload JwtPayload
   * @returns JWT token
   */
  private async generateJwtToken(payload: JwtPayload): Promise<AccessToken> {
    return { access_token: await this.jwtService.signAsync(payload) } as AccessToken;
  }
}
