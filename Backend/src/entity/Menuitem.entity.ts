import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import {
  Field,
  Float,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from "type-graphql";

import { Restaurant } from "./Restaurant.entity.js";
import { CartItem } from "./Cartitem.entity.js";
import { OrderItem } from "./Orderitem.entity.js";

@ObjectType()
@Entity("menuitems")
export class MenuItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ type: "varchar" })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  description: string;

  @Field(() => String)
  @Column({ type: "varchar" })
  category: string;

  @Field(() => Float)
  @Column({ type: "float" })
  price: number;

  @Field(() => Boolean)
  @Column({ type: "boolean", default: true })
  isVeg: boolean;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", nullable: true })
  imageUrl: string;

  @Field(() => Boolean)
  @Column({ type: "boolean", default: true })
  isAvailable: boolean;

  @Field(() => Boolean)
  @Column({ type: "boolean", default: false })
  trackStock: boolean;

  @Field(() => Int, { nullable: true })
  @Column({ type: "int", nullable: true })
  stockQuantity: number;

  @Field(() => Int)
  @Column({ type: "int" })
  restaurantId: number;

  @Field(() => Restaurant)
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "restaurantId" })
  restaurant: Restaurant;

  // @Field(() => [CartItem])
  @OneToMany(() => CartItem, (cartItem) => cartItem.menuItem)
  cartItems: CartItem[];

  // @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, (orderItem) => orderItem.menuItem)
  orderItems: OrderItem[];

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;
}
