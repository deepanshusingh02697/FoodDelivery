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
import { User } from "./User.entity.js";
import { MenuItem } from "./Menuitem.entity.js";
import { Cart } from "./Cart.entity.js";
import { Order } from "./Order.entity.js";
import { Review } from "./Review.entity.js";

export enum RestaurantStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

@Entity("restaurants")
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  restaurantName: string;

  @Column({ type: "varchar" })
  cuisine: string;

  @Column({ type: "varchar" })
  address: string;

  @Column({ type: "varchar", nullable: true })
  fssaiNumber: string;

  @Column({ type: "varchar", nullable: true })
  gstNumber: string;

  @Column({ type: "varchar" })
  phone: string;

  @Column({
    type: "enum",
    enum: RestaurantStatus,
    default: RestaurantStatus.PENDING,
  })
  status: RestaurantStatus;

  // relation
  @Column({ type: "int" })
  ownerId: number;

  @ManyToOne(() => User, (user) => user.restaurant, { onDelete: "CASCADE" })
  @JoinColumn({ name: "ownerId" })
  owner: User;

  //admin approval relation
  @Column({ type: "int", nullable: true })
  approvedBy?: number;

  @ManyToOne(() => User, (user) => user.approvedRestaurants, {
    nullable: true,
  })
  @JoinColumn({ name: "approvedBy" })
  admin: User;

  @Column({ type: "timestamp", nullable: true })
  approvedAt?: Date;

  @Column({ type: "text", nullable: true })
  adminNote?: string;

  //relation
  @OneToMany(() => MenuItem, (menu) => menu.restaurant)
  menus: MenuItem[];

  @OneToMany(() => Cart, (cart) => cart.restaurant)
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.restaurant)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.restaurant)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}