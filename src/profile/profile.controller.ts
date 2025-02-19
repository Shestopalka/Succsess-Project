import {
  Controller,
  Get,
  UseGuards,
  Request,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Post,
  Body,
  Put,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/s3/s3.service';
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly s3Service: S3Service,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile/friendlist')
  getFriendList(@Request() req) {
    const userId = req.user.userId;
    return this.profileService.friendList(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('setings/addPhoto')
  @UseInterceptors(
    FileInterceptor('filedName', {
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(new BadRequestException(), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async getAvatar(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const filedName = file.fieldname;
    const bufer = file.buffer;
    const mimeType = file.mimetype;
    const url = await this.s3Service.uploadFile(bufer, filedName, mimeType);
    console.log(url, 'controller');

    const userId = req.user.userId;
    return this.profileService.addAvatar(url, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.profileService.getProfile(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile/Edit/bio')
  addBio(@Body() body, @Request() req) {
    const { bio } = body;
    const userId = req.user.userId;
    return this.profileService.addBio(bio, userId);
  }
}
