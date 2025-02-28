import { Controller, UseGuards, Request, Patch, Body, Get } from '@nestjs/common';
import { ProfileSetingsService } from './profile-setings.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MailService } from 'src/mail/mail.service';

@Controller('profile-setings')
export class ProfileSetingsController {
  constructor(
      private readonly profileSetingsService: ProfileSetingsService,
      private readonly mailService: MailService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Patch('statusAccount')
  StatusAccount(@Request() req) {
    return this.profileSetingsService.StatusAccount(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verefycationUser')
  async VerefycationUser(@Request() req) {
    const vereficationURL = 'http://localhost:4000/profile-setings/vereficationUsers/resetPassword';
    await this.profileSetingsService.vereficationUserforResetPassword(req.user, vereficationURL);
    return vereficationURL
  }
  @UseGuards(JwtAuthGuard)
  @Patch('resetPassword')
  async ResetPassword(@Body() body: {newPassword: string}, @Request() req){
    return await this.profileSetingsService.resestUserPassword(body.newPassword, req.user);
  }
}
