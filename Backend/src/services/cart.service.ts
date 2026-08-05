import {
  cartItemRepository,
  cartRepository,
  menuItemRepository,
} from "../repositories/repository.js";

export class CartService {
  async AddToCart(input: any, userId: number) {
    if (input.quantity < 1) {
      throw new Error("Quantity must be greater than 0");
    }

    const menuItem = await menuItemRepository.findOne({
      where: {
        id: Number(input.menuItemId),
      },
    });

    if (!menuItem) {
      throw new Error("Menu item not found");
    }

    if (!menuItem.isAvailable) {
      throw new Error("This item is currently unavailable");
    }

    if (menuItem.trackStock && (menuItem.stockQuantity ?? 0) < input.quantity) {
      throw new Error(`Only ${menuItem.stockQuantity} left in stock`);
    }

    let cart = await cartRepository.findOne({
      where: {
        userId,
        restaurantId: menuItem.restaurantId,
      },
    });

    if (!cart) {
      cart = cartRepository.create({
        userId,
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
      const newQuantity = cartItem.quantity + input.quantity;

      if (menuItem.trackStock && (menuItem.stockQuantity ?? 0) < newQuantity) {
        throw new Error(`Only ${menuItem.stockQuantity} left in stock`);
      }

      cartItem.quantity = newQuantity;
      cartItem = await cartItemRepository.save(cartItem);
    } else {
      cartItem = cartItemRepository.create({
        cartId: cart.id,
        menuItemId: menuItem.id,
        quantity: input.quantity,
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

    return fullCart;
  }

  async DecreaseCartItem(cartItemId: string, userId: number) {
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

    if (cartItem.cart.userId !== userId) {
      throw new Error("Not your cart item");
    }

    if (cartItem.quantity <= 1) {
      await cartItemRepository.remove(cartItem);
    } else {
      cartItem.quantity--;
      await cartItemRepository.save(cartItem);
    }

    return await cartRepository.findOne({
      where: {
        id: cartItem.cartId,
      },
      relations: {
        items: {
          menuItem: true,
        },
      },
    });
  }

  async RemoveFromCart(cartItemId: string, userId: number) {
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

    if (cartItem.cart.userId !== userId) {
      throw new Error("Not your cart item");
    }

    await cartItemRepository.remove(cartItem);

    return await cartRepository.findOne({
      where: {
        id: cartItem.cartId,
      },
      relations: {
        items: {
          menuItem: true,
        },
      },
    });
  }

  async ClearCart(cartId: string, userId: number) {
    const cart = await cartRepository.findOne({
      where: {
        id: Number(cartId),
      },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    if (cart.userId !== userId) {
      throw new Error("This isn't your cart");
    }

    await cartItemRepository.delete({
      cartId: cart.id,
    });

    return {
      ...cart,
      items: [],
    };
  }

  async GetCart(restaurantId: number, userId: number) {
    return await cartRepository.findOne({
      where: {
        userId,
        restaurantId: Number(restaurantId),
      },
      relations: {
        items: {
          menuItem: true,
        },
        restaurant: true,
      },
    });
  }
}

export const cartService = new CartService();
