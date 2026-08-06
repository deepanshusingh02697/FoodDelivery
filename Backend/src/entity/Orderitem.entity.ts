import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MenuItem } from "./menuitem.entity.js";
import {
  Field,
  Float,
  ID,
  Int,
  ObjectType,
} from "type-graphql";
import { Order } from "./order.entity.js";

@ObjectType()
@Entity("orderitems")
export class OrderItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ type: "int" })
  orderId: number;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "orderId" })
  order: Order;

  @Field(() => Int, { nullable: true })
  @Column({ type: "int", nullable: true })
  menuItemId: number;

  @Field(() => MenuItem, { nullable: true })
  @ManyToOne(() => MenuItem, (menuItem) => menuItem.orderItems, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "menuItemId" })
  menuItem: MenuItem;

  @Field(() => String)
  @Column({ type: "varchar" })
  nameSnapshot: string;

  @Field(() => Float)
  @Column({ type: "float" })
  priceSnapshot: number;

  @Field(() => Int)
  @Column({ type: "int" })
  quantity: number;
}