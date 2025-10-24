import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { ResponseMessage } from 'src/common/decorators/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron } from '@nestjs/schedule';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  @Cron('0 10 0 * * 0') // 0h10p am every sunday
  @ResponseMessage('Send email subscriber')
  async handleSendEmail() {
    await this.mailService.sendSubscriberEmail();
  }
}
