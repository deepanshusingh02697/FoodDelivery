import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Field, GraphQLISODateTime, ID, Int, ObjectType } from "type-graphql";

import { User } from "./User.entity.js";
import { Restaurant } from "./Restaurant.entity.js";
import { CartItem } from "./Cartitem.entity.js";

@ObjectType()
@Entity("carts")
@Unique(["userId", "restaurantId"])
export class Cart {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ type: "int" })
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.carts, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User;

  @Field(() => Int)
  @Column({ type: "int" })
  restaurantId: number;

  @Field(() => Restaurant)
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.carts, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "restaurantId" })
  restaurant: Restaurant;

  @Field(() => [CartItem])
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: true,
  })
  items: CartItem[];

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;
}
