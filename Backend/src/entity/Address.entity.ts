import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, Float, GraphQLISODateTime, ID, ObjectType } from "type-graphql";

import { User } from "./user.entity.js";
import { Order } from "./order.entity.js";

@ObjectType()
@Entity("addresses")
export class Address {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => ID)
  @Column({ type: "int" })
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User;

  @Field(() => String)
  @Column({ type: "varchar" })
  addressLine1: string;

  @Field(() => String)
  @Column({ type: "varchar" })
  city: string;

  @Field(() => String)
  @Column({ type: "varchar" })
  pincode: string;

  @Field(() => String)
  @Column({ type: "varchar", default: "India" })
  country: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", nullable: true })
  label?: string;

  @Field(() => String)
  @Column({ type: "varchar" })
  state: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: "float", nullable: true })
  lat?: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: "float", nullable: true })
  lng?: number;

  @Field(() => Boolean)
  @Column({ type: "boolean", default: false })
  isDefault: boolean;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.deliveryAddress)
  orders: Order[];
}
