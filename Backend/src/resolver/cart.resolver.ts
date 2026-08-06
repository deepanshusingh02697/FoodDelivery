import {
  Resolver,
  Mutation,
  Query,
  Arg,
  Ctx,
  ID,
  FieldResolver,
  Root,
} from "type-graphql";
import { AddToCartInput } from "../Input/cart.input.js";
import { Context, isAuth } from "../middleware/context.js";
import { cartService } from "../services/cart.service.js";
import { Cart } from "../entity/cart.entity.js";
import { CartResponse } from "../Types/CartResonse.js";
import { CartItem } from "../entity/cartitem.entity.js";
import { Restaurant } from "../entity/restaurant.entity.js";
import { MenuItem } from "../entity/menuitem.entity.js";

@Resolver(()=>Cart)
export class CartResolver {
  @Mutation(() => CartResponse)
  async AddToCart(
    @Arg("input", () => AddToCartInput) input: AddToCartInput,
    @Ctx() ctx: Context,
  ) {
    isAuth(ctx);

    const cart = await cartService.AddToCart(input, ctx.userId!);

    return {
      success: true,
      msg: "Added to cart",
      cart,
    };
  }

  @Mutation(() => CartResponse)
  async DecreaseCartItem(
    @Arg("cartItemId", () => ID) cartItemId: string,
    @Ctx() ctx: Context,
  ) {
    isAuth(ctx);

    const cart = await cartService.DecreaseCartItem(cartItemId, ctx.userId!);

    return {
      success: true,
      msg: "Quantity updated",
      cart,
    };
  }

  @Query(() => Cart,{nullable:true})
  async GetCart(
    @Arg("restaurantId", () => ID) restaurantId: number,
    @Ctx() ctx: Context,
  ) {
    isAuth(ctx);

    return await cartService.GetCart(restaurantId, ctx.userId!);
  }

  @FieldResolver(() => [CartItem])
  async items(@Root() cart: Cart, @Ctx() ctx: Context) {
    return ctx.loaders.cartItemsByCartLoader.load(cart.id);
  }

  @FieldResolver(() => Restaurant)
  async restaurant(@Root() cart: Cart, @Ctx() ctx: Context) {
    return ctx.loaders.restaurantLoader.load(cart.restaurantId);
  }

}
