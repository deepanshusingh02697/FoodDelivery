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

  @Column({ type: "int" })
  userId: number;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "varchar" })
  addressLine1: string;

  @Column({ type: "varchar" })
  city: string;

  @Column({ type: "varchar" })
  pincode: string;

  @Column({ type: "varchar", default: "India" })
  country: string;

  @Column({ type: "varchar", nullable: true })
  label: string;

  @Column({ type: "varchar" })
  state: string;

  @Column({ type: "float", nullable: true })
  lat: number;

  @Column({ type: "float", nullable: true })
  lng: number;

  @Column({ type: "boolean", default: false })
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.deliveryAddress)
  orders: Order[];
}