import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { CartItem } from "../entity/cartitem.entity.js";
import { Cart } from "../entity/cart.entity.js";
import { Context } from "../middleware/context.js";
import { MenuItem } from "../entity/menuitem.entity.js";

@Resolver(() => CartItem)
export class CartItemResolver {

  @FieldResolver(() => Cart)
  async cart(
    @Root() cartItem: CartItem,
    @Ctx() ctx: Context
  ) {
    return ctx.loaders.cartLoader.load(cartItem.cartId);
  }


  @FieldResolver(() => MenuItem)
  async menuItem(
    @Root() cartItem: CartItem,
    @Ctx() ctx: Context
  ) {
    return ctx.loaders.menuItemLoader.load(cartItem.menuItemId);
  }

}