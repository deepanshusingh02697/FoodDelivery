import { Field, ObjectType } from "type-graphql";
import { Review } from "../entity/Review.entity.js";

@ObjectType()
export class ReviewResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => Review)
  review: Review;
}
