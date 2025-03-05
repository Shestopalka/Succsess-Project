import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeleteUsersDocumnet = HydratedDocument<DeleteUsers>;

@Schema()
export class DeleteUsers {
  @Prop()
  email: string;

  @Prop()
  name: string;

  @Prop()
  nickName: string;

  @Prop()
  surName: string;

  @Prop()
  avatar: string;

  @Prop()
  publicAccount: boolean;
}

export const DeleteUsersSchema = SchemaFactory.createForClass(DeleteUsers);