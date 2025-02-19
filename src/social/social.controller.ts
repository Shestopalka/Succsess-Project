import {
  Controller,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Post,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  UseGuards,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Request,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Get,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Body,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Delete,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Put,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SocialService } from './social.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('message')
export class SocialController {
  constructor(
    private readonly authService: AuthService,
    private readonly socialService: SocialService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('messageList')
  getMessage(@Request() req) {
    const user = req.user;
    return this.socialService.getMessage(user);
  }
}
