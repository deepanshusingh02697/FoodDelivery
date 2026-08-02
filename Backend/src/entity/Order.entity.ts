import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.entity.js";
import { Restaurant } from "./Restaurant.entity.js";
import { Address } from "./Address.entity.js";
import { OrderItem } from "./Orderitem.entity.js";
import { DeliveryTracking } from "./Deliverytracking.entity.js";

export enum OrderStatus {
  PLACED = "PLACED",
  PREPARING = "PREPARING",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
}

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  userId: number;
  @ManyToOne(() => User, (user) => user.orders, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "int" })
  restaurantId: number;
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "restaurantId" })
  restaurant: Restaurant;

  @Column({ type: "int", nullable: true })
  deliveryPartnerId?: number;
  @ManyToOne(() => User, (user) => user.deliveries, { nullable: true })
  @JoinColumn({ name: "deliveryPartnerId" })
  deliveryPartner: User;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PLACED,
  })
  status: OrderStatus;

  @Column({ type: "float" })
  subtotal: number;

  @Column({ type: "float" })
  deliveryFee: number;

  @Column({ type: "float" })
  totalAmount: number;

  @CreateDateColumn()
  placedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deliveredAt?: Date;

  @Column({ type: "int" })
  deliveryAddressId: number;
  @ManyToOne(() => Address, (address) => address.orders, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "deliveryAddressId" })
  deliveryAddress: Address;

  @Column({ type: "text" })
  addressSnapshot: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @OneToOne(() => DeliveryTracking, (tracking) => tracking.order)
  deliveryTracking: DeliveryTracking;
}