import { Controller, UseGuards, Request, Patch, Body } from '@nestjs/common';
import { ProfileSetingsService } from './profile-setings.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('profile-setings')
export class ProfileSetingsController {
  constructor(private readonly profileSetingsService: ProfileSetingsService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('statusAccount')
  StatusAccount(@Request() req) {
    return this.profileSetingsService.StatusAccount(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('resetPassword')
  resetPassword(@Request() req) {
  }
}
