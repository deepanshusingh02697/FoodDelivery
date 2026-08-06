import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import {
  Field,
  Float,
  ID,
  Int,
  ObjectType,
} from "type-graphql";

import { MenuItem } from "./menuitem.entity.js";
import { Cart } from "./cart.entity.js";

@ObjectType()
@Entity("cartitems")
export class CartItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ type: "int" })
  quantity: number;

  @Field(() => Float)
  @Column({ type: "float" })
  priceAtAdd: number;

  @Field(() => Int)
  @Column({ type: "int" })
  cartId: number;

  @ManyToOne(() => Cart, (cart) => cart.items, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "cartId" })
  cart: Cart;

  @Field(() => Int)
  @Column({ type: "int" })
  menuItemId: number;

  @Field(() => MenuItem)
  @ManyToOne(() => MenuItem, (menuItem) => menuItem.cartItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "menuItemId" })
  menuItem: MenuItem;
}