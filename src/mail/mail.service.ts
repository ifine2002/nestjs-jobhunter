import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { Subscriber, SubscriberDocument } from 'src/subscribers/schemas/subscriber.schema';

@Injectable()
export class MailService {
  constructor(
    @InjectModel(Subscriber.name)
    private readonly subscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name)
    private readonly jobModel: SoftDeleteModel<JobDocument>,
    private mailerService: MailerService
  ) {}

  async sendSubscriberEmail() {
    const subscribers = await this.subscriberModel.find({});
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } });
      if (jobWithMatchingSkills?.length) {
        const jobs = jobWithMatchingSkills.map((item) => ({
          name: item.name,
          company: item.company.name,
          salary: `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ',
          skills: item.skills,
        }));

        await this.mailerService.sendMail({
          to: subs.email,
          from: '"Support Team" <support@example.com>',
          subject: 'Welcome to Nice App! Confirm your Email',
          template: 'new-job',
          context: {
            receiver: subs.name,
            jobs: jobs,
          },
        });
      }
    }
  }
}
