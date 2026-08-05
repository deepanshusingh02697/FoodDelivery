import { Field, Float, ID, InputType, Int } from "type-graphql";


@InputType()
export class CreateMenuItemInput {

  @Field(() => String)
  name!: string;

  @Field(() => Float)
  price!: number;

  @Field(() => String)
  category!: string;

  @Field(() => Boolean)
  isVeg!: boolean;

  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @Field(() => Boolean, { nullable: true })
  trackStock?: boolean;

  @Field(() => Int, { nullable: true })
  stockQuantity?: number;

  @Field(() => String, { nullable: true })
  description?: string;
}



@InputType()
export class UpdateMenuItemInput {

  @Field(() => ID)
  menuItemId!: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => Boolean, { nullable: true })
  isVeg?: boolean;

  @Field(() => String, { nullable: true })
  imageUrl?: string;
}



@InputType()
export class MenuItemIdInput {

  @Field(() => ID)
  menuItemId!: string;
}



@InputType()
export class UpdateStockInput {

  @Field(() => ID)
  menuItemId!: string;

  @Field(() => Int)
  stockQuantity!: number;
}