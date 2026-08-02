import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./Cart.entity.js";
import { MenuItem } from "./Menuitem.entity.js";

@Entity("cartitems")
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "float" })
  priceAtAdd: number;

  @Column({ type: "int" })
  cartId: number;
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cartId" })
  cart: Cart;

  @Column({ type: "int" })
  menuItemId: number;
  @ManyToOne(() => MenuItem, (menuItem) => menuItem.cartItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "menuItemId" })
  menuItem: MenuItem;
}