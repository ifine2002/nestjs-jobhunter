import { Model } from 'mongoose';

export interface MongooseDeleteModel<T> extends Model<T> {
  delete(filter: any, deletedBy?: any): any;
  restore(filter: any): any;
  findDeleted(filter: any): any;
  findWithDeleted(filter: any): any;
}
