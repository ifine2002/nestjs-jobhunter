import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { ResponseMessage } from 'src/common/decorators/customize';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  @ResponseMessage('Send email subscriber')
  async handleSendEmail() {
    await this.mailService.sendSubscriberEmail();
  }
}
