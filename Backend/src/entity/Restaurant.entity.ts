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

import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from "type-graphql";

import { User } from "./user.entity.js";
import { MenuItem } from "./menuitem.entity.js";
import { Cart } from "./cart.entity.js";
import { Order } from "./order.entity.js";
import { Review } from "./review.entity.js";

export enum RestaurantStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

registerEnumType(RestaurantStatus, {
  name: "RestaurantStatus",
  description: "Restaurant Status",
});

@ObjectType()
@Entity("restaurants")
export class Restaurant {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ type: "varchar" })
  restaurantName: string;

  @Field(() => String)
  @Column({ type: "varchar" })
  cuisine: string;

  @Field(() => String)
  @Column({ type: "varchar" })
  address: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", nullable: true })
  fssaiNumber: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", nullable: true })
  gstNumber: string;

  @Field(() => String)
  @Column({ type: "varchar" })
  phone: string;

  @Field(() => RestaurantStatus)
  @Column({
    type: "enum",
    enum: RestaurantStatus,
    default: RestaurantStatus.PENDING,
  })
  status: RestaurantStatus;

  @Field(() => Int)
  @Column({ type: "int" })
  ownerId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.restaurant, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "ownerId" })
  owner: User;

  @Field(() => Int, { nullable: true })
  @Column({ type: "int", nullable: true })
  approvedBy?: number;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.approvedRestaurants, {
    nullable: true,
  })
  @JoinColumn({ name: "approvedBy" })
  admin?: User;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: "timestamp", nullable: true })
  approvedAt?: Date;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  adminNote?: string;

  @Field(() => [MenuItem])
  @OneToMany(() => MenuItem, (menu) => menu.restaurant)
  menus: MenuItem[];

  @Field(() => [Cart])
  @OneToMany(() => Cart, (cart) => cart.restaurant)
  carts: Cart[];

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.restaurant)
  orders: Order[];

  @Field(() => [Review])
  @OneToMany(() => Review, (review) => review.restaurant)
  reviews: Review[];

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;
}
