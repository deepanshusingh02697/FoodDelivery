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
import { Field, Float, GraphQLISODateTime, ID, Int, ObjectType, registerEnumType } from "type-graphql";

export enum OrderStatus {
  PLACED = "PLACED",
  PREPARING = "PREPARING",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
}
registerEnumType(OrderStatus,{
   name: "OrderStatus",
  description: "Order status",
})

@ObjectType()
@Entity("orders")
export class Order {
  @Field(()=>ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(()=>Int)
  @Column({ type: "int" })
  userId: number;

  @Field(()=>User)
  @ManyToOne(() => User, (user) => user.orders, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Field(()=>Int)
  @Column({ type: "int" })
  restaurantId: number;

  @Field(()=>Restaurant)
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "restaurantId" })
  restaurant: Restaurant;

  @Field(() => Int, { nullable: true })
  @Column({ type: "int", nullable: true })
  deliveryPartnerId?: number;

  @Field(()=>User,{ nullable: true })
  @ManyToOne(() => User, (user) => user.deliveries, { nullable: true })
  @JoinColumn({ name: "deliveryPartnerId" })
  deliveryPartner?: User;

  @Field(()=>OrderStatus)
  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PLACED,
  })
  status: OrderStatus;

  @Field(()=>Float)
  @Column({ type: "float" })
  subtotal: number;

  @Field(()=>Float)
  @Column({ type: "float" })
  deliveryFee: number;

  @Field(()=>Float)
  @Column({ type: "float" })
  totalAmount: number;

  @Field(()=>GraphQLISODateTime)
  @CreateDateColumn()
  placedAt: Date;

  @Field(()=>GraphQLISODateTime,{nullable:true})
  @Column({ type: "timestamp", nullable: true })
  deliveredAt?: Date;

  @Field(()=>Int)
  @Column({ type: "int" })
  deliveryAddressId: number;

  @Field(()=>Address)
  @ManyToOne(() => Address, (address) => address.orders, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "deliveryAddressId" })
  deliveryAddress: Address;

  @Field(()=>String)
  @Column({ type: "text" })
  addressSnapshot: string;

  @Field(()=>[OrderItem])
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @Field(()=>DeliveryTracking,{ nullable: true })
  @OneToOne(() => DeliveryTracking, (tracking) => tracking.order)
  deliveryTracking?: DeliveryTracking;
}