import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User.entity.js";
import { Order } from "./Order.entity.js";

@Entity("addresses")
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  //foreign key
  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User;

  //fields
  @Column()
  addressLine1: string;

  @Column()
  city: string;

  @Column()
  pincode: string;

  @Column({
    default: "India",
  })
  country: string;

  @Column({
   nullable:true
})
label:string;

@Column()
state:string;

  @Column({
    type: "float",
    nullable: true,
  })
  lat: number;

  @Column({
    type: "float",
    nullable: true,
  })
  lng: number;

  @Column({
    default: false,
  })
  isDefault: boolean;

  //Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relation
  @OneToMany(() => Order, (order) => order.deliveryAddress)
  orders: Order[];
}
