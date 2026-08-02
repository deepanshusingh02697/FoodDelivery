import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Order } from "./Order.entity.js";

@Entity("delivery_tracking")
export class DeliveryTracking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", unique: true })
  orderId: number;

  @OneToOne(() => Order, (order) => order.deliveryTracking, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "orderId" })
  order: Order;

  @Column({ type: "float" })
  lat: number;

  @Column({ type: "float" })
  lng: number;

  @UpdateDateColumn()
  updatedAt: Date;
}