import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { ProfileService } from 'src/profile/profile.service';
// import { extname } from 'path';
// import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucketName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly profileService: ProfileService,
  ) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });

    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET');
  }
  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await this.s3.send(command);
    const url = `https://${this.bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${fileName}`;
    console.log(url, 'S3');

    return url;
  }
}
