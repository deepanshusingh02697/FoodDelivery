import { Field, ObjectType } from "type-graphql";
import { Address } from "../entity/address.entity.js";

@ObjectType()
export class AddressResponse{

    @Field(() => Boolean)
    success: boolean;

    @Field(() => String)
    msg: string;

    @Field(() => Address, { nullable: true })
    address?: Address;
}