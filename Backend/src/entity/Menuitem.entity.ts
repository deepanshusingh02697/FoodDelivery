import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Restaurant } from "./Restaurant.entity.js";
import { CartItem } from "./Cartitem.entity.js";
import { OrderItem } from "./Orderitem.entity.js";

@Entity("menuitems")
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar" })
  category: string;

  @Column({ type: "float" })
  price: number;

  @Column({ type: "boolean", default: true })
  isVeg: boolean;

  @Column({ type: "varchar", nullable: true })
  imageUrl: string;

  @Column({ type: "boolean", default: true })
  isAvailable: boolean;

  @Column({ type: "boolean", default: false })
  trackStock: boolean;

  @Column({ type: "int", nullable: true })
  stockQuantity: number;

  @Column({ type: "int" })
  restaurantId: number;
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "restaurantId" })
  restaurant: Restaurant;

  @OneToMany(() => CartItem, (cartItem) => cartItem.menuItem)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.menuItem)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;
}