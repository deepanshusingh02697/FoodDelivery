import { Arg, Ctx, ID, Int, Mutation, Resolver } from "type-graphql";
import { CartResponse } from "../../Types/CartResonse.js";
import { Context, isAuth } from "../../../graphql/context.js";
import {
  cartItemRepository,
  cartRepository,
  menuItemRepository,
} from "../../repositories/repository.js";

@Resolver()
export class CartResolver {
  @Mutation(() => CartResponse)
  async AddToCart(
    @Arg("menuItemId", () => ID) menuItemId: string,
    @Arg("quantity", () => Int) quantity: number,
    @Ctx() ctx: Context,
  ) {
    isAuth(ctx);

    if (quantity < 1) {
      throw new Error("Quantity must be greater than 0");
    }

    const menuItem = await menuItemRepository.findOne({
      where: {
        id: Number(menuItemId),
      },
    });

    if (!menuItem) {
      throw new Error("Menu item not found");
    }

    if (!menuItem.isAvailable) {
      throw new Error("This item is currently unavailable");
    }

    if (menuItem.trackStock && (menuItem.stockQuantity ?? 0) < quantity) {
      throw new Error(`Only ${menuItem.stockQuantity} left in stock`);
    }

    let cart = await cartRepository.findOne({
      where: {
        userId: ctx.userId!,
        restaurantId: menuItem.restaurantId,
      },
    });

    if (!cart) {
      cart = cartRepository.create({
        userId: ctx.userId!,
        restaurantId: menuItem.restaurantId,
      });

      cart = await cartRepository.save(cart);
    }

    let cartItem = await cartItemRepository.findOne({
      where: {
        cartId: cart.id,
        menuItemId: menuItem.id,
      },
    });

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;

      if (menuItem.trackStock && (menuItem.stockQuantity ?? 0) < newQuantity) {
        throw new Error(`Only ${menuItem.stockQuantity} left in stock`);
      }

      cartItem.quantity = newQuantity;
      cartItem = await cartItemRepository.save(cartItem);
    } else {
      cartItem = cartItemRepository.create({
        cartId: cart.id,
        menuItemId: menuItem.id,
        quantity,
        priceAtAdd: menuItem.price,
      });

      cartItem = await cartItemRepository.save(cartItem);
    }

    const fullCart = await cartRepository.findOne({
      where: {
        id: cart.id,
      },
      relations: {
        items: {
          menuItem: true,
        },
      },
    });

    return {
      success: true,
      msg: "Added to cart",
      cart: fullCart,
    };
  }

  @Mutation(() => CartResponse)
  async DecreaseCartItem(
    @Arg("cartItemId", () => ID) cartItemId: string,
    @Ctx() ctx: Context,
  ) {
    isAuth(ctx);

    const cartItem = await cartItemRepository.findOne({
      where: {
        id: Number(cartItemId),
      },
      relations: {
        cart: true,
      },
    });

    if (!cartItem) {
      throw new Error("NOT_FOUND");
    }

    if (cartItem.cart.userId !== ctx.userId) {
      throw new Error("Not your cart item");
    }

    if (cartItem.quantity <= 1) {
      await cartItemRepository.remove(cartItem);
    } else {
      cartItem.quantity--;
      await cartItemRepository.save(cartItem);
    }

    const fullCart = await cartRepository.findOne({
      where: {
        id: cartItem.cartId,
      },
      relations: {
        items: {
          menuItem: true,
        },
      },
    });

    return {
      success: true,
      msg: "Quantity updated",
      cart: fullCart,
    };
  }

  @Mutation(() => CartResponse)
  async RemoveFromCart(
    @Arg("cartItemId", () => ID) cartItemId: string,
    @Ctx() ctx: Context,
  ) {
    isAuth(ctx);

    const cartItem = await cartItemRepository.findOne({
      where: {
        id: Number(cartItemId),
      },
      relations: {
        cart: true,
      },
    });

    if (!cartItem) {
      throw new Error("NOT_FOUND");
    }

    if (cartItem.cart.userId !== ctx.userId) {
      throw new Error("Not your cart item");
    }

    await cartItemRepository.remove(cartItem);

    const fullCart = await cartRepository.findOne({
      where: {
        id: cartItem.cartId,
      },
      relations: {
        items: {
          menuItem: true,
        },
      },
    });

    return {
      success: true,
      msg: "Item removed",
      cart: fullCart,
    };
  }

  @Mutation(() => CartResponse)
  async ClearCart(
    @Arg("cartId", () => ID) cartId: string,
    @Ctx() ctx: Context,
  ) {
    isAuth(ctx);

    const cart = await cartRepository.findOne({
      where: {
        id: Number(cartId),
      },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    if (cart.userId !== ctx.userId) {
      throw new Error("This isn't your cart");
    }

    await cartItemRepository.delete({
      cartId: cart.id,
    });

    return {
      success: true,
      msg: "Cart cleared",
      cart: {
        ...cart,
        items: [],
      },
    };
  }
}
