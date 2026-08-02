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

  @Column({
    unique: true,
  })
  orderId: number;

  @OneToOne(() => Order, (order) => order.deliveryTracking, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "orderId" })
  order: Order;

  @Column("float")
  lat: number;

  @Column("float")
  lng: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
