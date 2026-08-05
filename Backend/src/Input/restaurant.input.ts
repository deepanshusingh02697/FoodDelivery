import { Field, Float, InputType } from "type-graphql";


@InputType()
export class RegisterRestaurantOwnerInput {

  @Field(() => String)
  firstname!: string;

  @Field(() => String)
  lastname!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;

  @Field(() => String)
  phone!: string;

  @Field(() => String)
  restaurantName!: string;

  @Field(() => String)
  cuisine!: string;

  @Field(() => String)
  address!: string;

  @Field(() => String, { nullable: true })
  fssaiNumber?: string;

  @Field(() => String, { nullable: true })
  gstNumber?: string;

}

@InputType()
export class FilterRestaurantsInput {
  @Field(() => String, { nullable: true })
  search?: string;

  @Field(() => String, { nullable: true })
  cuisine?: string;

  @Field(() => Boolean, { nullable: true })
  vegOnly?: boolean;

  @Field(() => Float, { nullable: true })
  rating?: number;
}