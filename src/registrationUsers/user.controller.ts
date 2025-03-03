import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Param,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('registration')
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    const vereficationToken = await this.userService.createUser(createUserDto);
    if (vereficationToken)
      return `http://localhost:3000/users/auth/verify-email${vereficationToken}`;
  }
  @Post('/auth/verify-email:vereficationToken')
  @UsePipes(new ValidationPipe())
  async verifycationEmail(
    @Body() body: { verefyPass: string },
    @Param('vereficationToken') vereficationToken: string,
  ) {
    const pass = body.verefyPass;

    return this.userService.VereficationUserPass(pass, vereficationToken);
  }
}
