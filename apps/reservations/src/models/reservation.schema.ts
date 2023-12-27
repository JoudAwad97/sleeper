import { AbstractDocument } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Combining the GraphQL schema with the Mongoose schema
 * so we do not hve to write the same code twice
 */
@Schema({
  versionKey: false,
})
@ObjectType()
export class ReservationDocument extends AbstractDocument {
  @Prop()
  @Field()
  timestamp: Date;

  @Prop()
  @Field()
  startDate: Date;

  @Prop()
  @Field()
  endDate: Date;

  @Prop()
  @Field()
  userId: string;

  @Prop()
  @Field()
  invoiceId: string;
}

export const ReservationSchema =
  SchemaFactory.createForClass(ReservationDocument);
