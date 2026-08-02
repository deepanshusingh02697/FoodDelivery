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
import { User } from "./User.entity.js";
import { Restaurant } from "./Restaurant.entity.js";
import { CartItem } from "./Cartitem.entity.js";

@Entity("carts")
@Unique(["userId", "restaurantId"]) //only one cart per restaurant
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer" })
  userId: number;
  @ManyToOne(() => User, (user) => user.carts, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "integer" })
  restaurantId: number;
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.carts, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "restaurantId" })
  restaurant: Restaurant;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: true,
  })
  items: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
