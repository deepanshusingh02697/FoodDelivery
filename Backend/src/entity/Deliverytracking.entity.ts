import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import {
  Field,
  Float,
  GraphQLISODateTime,
  ID,
  Int,
 ObjectType,
} from "type-graphql";

import { Order } from "./order.entity.js";

@ObjectType()
@Entity("delivery_tracking")
export class DeliveryTracking {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ type: "int", unique: true })
  orderId: number;

  @Field(() => Order)
  @OneToOne(() => Order, (order) => order.deliveryTracking, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "orderId" })
  order: Order;

  @Field(() => Float)
  @Column({ type: "float" })
  lat: number;

  @Field(() => Float)
  @Column({ type: "float" })
  lng: number;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;
}