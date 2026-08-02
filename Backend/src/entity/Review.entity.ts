import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { User } from "./User.entity.js";
import { Restaurant } from "./Restaurant.entity.js";

@Entity("reviews")
@Unique(["userId", "restaurantId"])
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "int",
  })
  rating: number;

  @Column({
    type: "text",
    nullable: true,
  })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  restaurantId: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reviews, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "restaurantId" })
  restaurant: Restaurant;
}
