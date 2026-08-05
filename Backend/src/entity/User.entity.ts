import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from "type-graphql";

import { Restaurant } from "./restaurant.entity.js";
import { Order } from "./order.entity.js";
import { Cart } from "./cart.entity.js";
import { Review } from "./review.entity.js";
import { Address } from "./address.entity.js";

export enum Role {
  CUSTOMER = "CUSTOMER",
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  DELIVERY_PARTNER = "DELIVERY_PARTNER",
}

registerEnumType(Role, {
  name: "Role",
  description: "User roles",
});

@ObjectType()
@Entity("users")
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ type: "varchar" })
  firstname: string;

  @Field(() => String)
  @Column({ type: "varchar" })
  lastname: string;

  @Field(() => String)
  @Column({ type: "varchar", unique: true })
  email: string;

  // Don't expose password in GraphQL
  @Column({ type: "varchar" })
  password: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", nullable: true })
  phone: string;

  @Field(() => Boolean)
  @Column({ type: "boolean", default: false })
  phoneVerified: boolean;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Role)
  @Column({
    type: "enum",
    enum: Role,
    default: Role.CUSTOMER,
  })
  role: Role;

  @Field(() => [Address])
  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @Field(() => [Restaurant])
  @OneToMany(() => Restaurant, (restaurant) => restaurant.owner)
  restaurant: Restaurant[];

  @Field(() => [Restaurant])
  @OneToMany(() => Restaurant, (restaurant) => restaurant.admin)
  approvedRestaurants: Restaurant[];

  @Field(() => [Cart])
  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.deliveryPartner)
  deliveries: Order[];

  @Field(() => [Review])
  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
