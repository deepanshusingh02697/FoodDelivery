import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./Order.entity.js";
import { MenuItem } from "./Menuitem.entity.js";

@Entity("orderitems")
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  orderId: number;
  @ManyToOne(() => Order, (order) => order.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "orderId" })
  order: Order;

  @Column({ type: "int", nullable: true })
  menuItemId: number;
  @ManyToOne(() => MenuItem, (menuItem) => menuItem.orderItems, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "menuItemId" })
  menuItem: MenuItem;

  @Column({ type: "varchar" })
  nameSnapshot: string;

  @Column({ type: "float" })
  priceSnapshot: number;

  @Column({ type: "int" })
  quantity: number;
}