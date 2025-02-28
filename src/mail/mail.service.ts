import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async VereficationUsers(
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

  async VereficationResetPassword(
    to: string,
    username: string,
    vereficationURL: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: to,
      subject: 'Reset password',
      template: 'resetPass',
      context: {
        vereficationURL,
        username,
      },
    });
  }
}
