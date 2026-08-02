import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Address } from "./Address.entity.js";
import { Restaurant } from "./Restaurant.entity.js";
import { Order } from "./Order.entity.js";
import { Cart } from "./Cart.entity.js";
import { Review } from "./Review.entity.js";

export enum Role {
  CUSTOMER = "CUSTOMER",
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  DELIVERY_PARTNER = "DELIVERY_PARTNER",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column({ default: false })
  phoneVerified: boolean;

  @CreateDateColumn({
    name: "created_at",
  })
  created_at: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.CUSTOMER,
  })
  role: Role;

  //Relations

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Restaurant, (restaurant) => restaurant.owner)
  restaurant: Restaurant[];

  @OneToMany(() => Restaurant, (restaurant) => restaurant.admin)
  approvedRestaurants: Restaurant[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Order, (order) => order.deliveryPartner)
  deliveries: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
