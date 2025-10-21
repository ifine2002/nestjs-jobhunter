import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './schemas/job.schema';
import { JobsController } from './jobs.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }])],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
