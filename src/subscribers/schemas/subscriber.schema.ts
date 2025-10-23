import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from 'src/common/schemas/base.schema';

export type SubscriberDocument = HydratedDocument<Subscriber>;

@Schema({ timestamps: true })
export class Subscriber extends BaseSchema {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  name: string;

  @Prop()
  skills: string[];
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
