import {
  Controller,
  UseGuards,
  Request,
  Patch,
  Body,
  Get,
  Delete,
  Post,
  BadRequestException,
  Query,
  Put,
} from '@nestjs/common';
import { ProfileSetingsService } from './profile-setings.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/registrationUsers/user.service';

@Controller('profile-settings')
export class ProfileSetingsController {
  constructor(
    private readonly profileSetingsService: ProfileSetingsService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Patch('statusAccount')
  StatusAccount(@Request() req) {
    return this.profileSetingsService.StatusAccount(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('changePassword')
  async changeUserPassword(@Body() body: { newPassword: string }, @Request() req){
    
    return await this.profileSetingsService.vereficationForChangePassword(
      req.user,
      body.newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('changePassword/verify')
  async changePassword(@Query('token') token: string) {
    if (!token) throw new BadRequestException('Token is required');

    const isValid = await this.userService.verefyResetToken(token);

    if (!isValid) throw new BadRequestException('Invalid or expired token');

    await this.profileSetingsService.confirmResetPassword(token);

    return { message: 'Token is valid. You password changed' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('accountDeleted')
  async deleteUserAccount(@Request() req) {
    await this.profileSetingsService.vereficationForDeleteUserAccount(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('accountDeleted/verify')
  async deleteAccount(@Query('token') token: string) {
    if (!token) throw new BadRequestException('Token is requered');

    const isValid = await this.userService.verefyResetToken(token);

    if (!isValid) throw new BadRequestException('Invaild or expired token');

    await this.profileSetingsService.confrimDeleteAccount(token);

    return { message: 'Token is valid. Account has been deleted' };
  }
}
