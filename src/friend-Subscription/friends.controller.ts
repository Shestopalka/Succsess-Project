import {
  Body,
  Controller,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Post,
  UseGuards,
  Request,
  Put,
  Delete,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  subscribbeUser(@Param('nickName') nickName: string, @Request() req) {
    const userId = req.user.userId;
    return this.friendsService.subscription(nickName, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile:nickName/unsubscribe')
  unsubscribe(@Param('nickName') nickName: string, @Request() req) {
    const user = req.user;

    return this.friendsService.unsubscribeUser(nickName, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile:nickName')
  async getUserProfile(@Param('nickName') nickName: string) {
    const user = await this.friendsService.FindUser(nickName);
    console.log(user);

    return this.profileService.getProfile(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('friendlist/deletefriend')
  deleteFriend(@Body() nick: string, @Request() req) {
    const nickName = nick;
    console.log(nickName, 'controller');

    const userId = req.user.userId;
    console.log(userId, 'controller ');

    return this.friendsService.deliteFriends(nickName, userId);
  }
}
