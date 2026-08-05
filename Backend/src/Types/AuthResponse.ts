import { Field, ObjectType } from "type-graphql";
import { User } from "../entity/user.entity.js";

@ObjectType()
export class AuthResponse{

    @Field(() => Boolean)
    success: boolean;

    @Field(() => String)
    msg: string;

    @Field(() => User,{ nullable: true })
    user: User;
}