import { Field, ID, InputType, Int } from "type-graphql";

@InputType()
export class AddToCartInput {
  @Field(() => ID)
  menuItemId!: string;

  @Field(() => Int)
  quantity!: number;
}
