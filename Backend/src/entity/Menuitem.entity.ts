import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Restaurant } from "./Restaurant.entity.js";
import { CartItem } from "./Cartitem.entity.js";
import { OrderItem } from "./Orderitem.entity.js";

@Entity("menuitems")
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: "text",
    nullable: true,
  })
  description: string;

  @Column()
  category: string;

  @Column("float")
  price: number;

  @Column({
    default: true,
  })
  isVeg: boolean;

  @Column({
    nullable: true,
  })
  imageUrl: string;

  @Column({
    default: true,
  })
  isAvailable: boolean;

  @Column({
    default: false,
  })
  trackStock: boolean;

  @Column({
    nullable: true,
  })
  stockQuantity: number;

  @Column()
  restaurantId: number;
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "restaurantId" })
  restaurant: Restaurant;

  @OneToMany(() => CartItem, (cartItem) => cartItem.menuItem)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.menuItem)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;
}
