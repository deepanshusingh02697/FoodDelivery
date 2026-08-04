import { Field, ObjectType } from "type-graphql";
import { Restaurant } from "../entity/Restaurant.entity.js";

@ObjectType()
export class RestaurantResponse{

    @Field(() => Boolean)
    success: boolean;

    @Field(() => String)
    msg: string;

    @Field(() => Restaurant)
    restaurant:Restaurant
}