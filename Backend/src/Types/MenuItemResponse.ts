import { Field, ObjectType } from "type-graphql";
import { MenuItem } from "../entity/Menuitem.entity.js";

@ObjectType()
export class MenuItemResponse{

    @Field(() => Boolean)
    success: boolean;

    @Field(() => String)
    msg: string;

    @Field(() => MenuItem,{ nullable: true })
    menuItem: MenuItem;
}