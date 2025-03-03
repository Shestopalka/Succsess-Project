import { TooManyParts } from '@aws-sdk/client-s3';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async vereficationEmail(
    to: string,
    username: string,
    randomNumber: number,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: to, // кому відправляється
      subject: 'Welcome to the Success project.',
      template: 'welcome', // Без './'
      context: {
        randomNumber,
        username,
      },
    });
  }

  async vereficationUsersEmail(
    to: string,
    vereficationURL: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: to,
      subject: 'Verefication User',
      template: 'Verefication',
      context: {
        vereficationURL,
      },
    });
  }

  async accountDeletionMessage(to: string, name: string): Promise<void>{
    await this.mailerService.sendMail({
      to: to,
      subject: 'Your account has been deleted.',
      template: 'accountDeleted',
      context:{
        name,
      }
    })
  }
}
