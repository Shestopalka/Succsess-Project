import { Controller } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  //   @Post('send')
  //   async sendMail(@Body() body: { email: string; username: string }) {
  //     await this.mailService.VereficationUsers(body.email, body.username);
  //     return { message: 'Email send successfuly!' };
  //   }
}
