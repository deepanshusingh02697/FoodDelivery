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

  
  @Column()
  orderId: number;
  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "orderId" })
  order: Order;



  @Column({
    nullable: true,
  })
  menuItemId: number;
  @ManyToOne(() => MenuItem, (menuItem) => menuItem.orderItems, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "menuItemId" })
  menuItem: MenuItem;


  @Column()
  nameSnapshot: string;

  @Column("float")
  priceSnapshot: number;

  @Column()
  quantity: number;
}
