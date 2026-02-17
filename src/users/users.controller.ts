import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dtos/register.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { LoginDto } from './dtos/login.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('/api/users')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('/api/users/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  @Post('/api/users/register')
  register(@Body() body: RegisterDto) {
    return this.usersService.register(body);
  }

  
  @Post('/api/users/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginDto) {
    return this.usersService.login(body);
  }

  @Put('/api/users/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(parseInt(id), body);
  }

  @Delete('/api/users/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(parseInt(id));
  }
}
