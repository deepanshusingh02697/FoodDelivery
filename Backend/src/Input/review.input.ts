import { Field, ID, Int, InputType } from "type-graphql";

@InputType()
export class SubmitReviewInput {
  @Field(() => ID)
  restaurantId!: string;

  @Field(() => Int)
  rating!: number;

  @Field(() => String, { nullable: true })
  comment?: string;
}

@InputType()
export class UpdateReviewInput {
  @Field(() => ID)
  reviewId!: string;

  @Field(() => Int, { nullable: true })
  rating?: number;

  @Field(() => String, { nullable: true })
  comment?: string;
}
