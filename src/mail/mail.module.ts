import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailController } from './mail.controller';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // SMTP сервер
        port: 587, // Порт SMTP
        secure: false, // true для порта 465 (SSL), false для інших
        auth: {
          user: 'succsessproject.mykhailo@gmail.com', // Логін (email)
          pass: 'qgjl jwbx cltj ogon', // Пароль або API-ключ
        },
      },
      defaults: {
        from: '"Success" <support@example.com>', // Відправник за замовчуванням
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService], // експорт сервісу
})
export class MailModule {}
