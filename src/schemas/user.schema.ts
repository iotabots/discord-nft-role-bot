import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, validate: /^0x[a-fA-F0-9]{40}$/, required: true })
  ethAddr: string;

  @Prop({ unique: true, required: true })
  discordUser: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
