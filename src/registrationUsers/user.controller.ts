import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Param,
  Get,
  BadGatewayException,
  Query,
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

  @Get('registration/returnUser')
  @UsePipes(new ValidationPipe())
  async returnAccounUser(@Query('token') token: string) {
    if (!token) throw new BadGatewayException();

    const tokenValid = await this.userService.verefyResetToken(token);

    if (!tokenValid) throw new BadGatewayException();

    return await this.userService.returnUsers(token);
  }
}
