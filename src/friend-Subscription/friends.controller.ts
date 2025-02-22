import {
  Body,
  Controller,
  UseGuards,
  Request,
  Put,
  Delete,
  Get,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FriendsService } from './friends.service';
import { ProfileService } from 'src/profile/profile.service';
@Controller('screach')
export class FriendsController {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly profileService: ProfileService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Put('profile:nickName/subscribe')
  async subscribbeUser(@Param('nickName') nickName: string, @Request() req) {
    return await this.friendsService.subscription(nickName, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile:nickName/unsubscribe')
  async unsubscribe(@Param('nickName') nickName: string, @Request() req) {
    return await this.friendsService.unsubscribeUser(nickName, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile:nickName')
  async getUserProfile(@Param('nickName') nickName: string) {
    const user = await this.friendsService.FindUser(nickName);

    return await this.profileService.getProfile(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('friendlist/deletefriend')
  async deleteFriend(@Body() nick: string, @Request() req) {
    return await this.friendsService.deliteFriends(nick, req.user.userId);
  }
}
