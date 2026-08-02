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

  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  restaurantId: number;
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "restaurantId" })
  restaurant: Restaurant;

  @Column({
    nullable: true,
  })
  deliveryPartnerId?: number;

  @ManyToOne(() => User, (user) => user.deliveries, {
    nullable: true,
  })
  @JoinColumn({ name: "deliveryPartnerId" })
  deliveryPartner: User;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PLACED,
  })
  status: OrderStatus;

  //fields

  @Column("float")
  subtotal: number;

  @Column("float")
  deliveryFee: number;

  @Column("float")
  totalAmount: number;

  @CreateDateColumn()
  placedAt: Date;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  deliveredAt?: Date;


  @Column()
orderId:number;

@ManyToOne(()=>Order,{
    onDelete:"CASCADE"
})
@JoinColumn({name:"orderId"})
order:Order;

  //delivery address
  @Column()
  deliveryAddressId:number;

  @ManyToOne(()=>Address,(address)=>address.orders,{
    onDelete:"CASCADE"
  })
  @JoinColumn({name:"deliveryAddressId"})
  deliveryAddress:Address

  @Column("text")
  addressSnapshot:string

  @OneToMany(()=>OrderItem,(item)=>item.order,{
    cascade:true,
  })
  items:OrderItem[]


  @OneToOne(
    () => DeliveryTracking,
    (tracking) => tracking.order
  )
  deliveryTracking: DeliveryTracking;

}
