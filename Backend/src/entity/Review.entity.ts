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
import { Field, GraphQLISODateTime, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity("reviews")
@Unique(["userId", "restaurantId"])
export class Review {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ type: "int" })
  rating: number;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  comment: string;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Int)
  @Column({ type: "int" })
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User;

  @Field(() => Int)
  @Column({ type: "int" })
  restaurantId: number;

  @Field(() => Restaurant)
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reviews, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "restaurantId" })
  restaurant: Restaurant;
}
