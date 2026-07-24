import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Cart_Interface, CartItem_Interface } from "../../graphql/Client";

interface CartState {
  cartId: string | null;
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem_Interface[];
}

const initialState: CartState = {
  cartId: null,
  restaurantId: null,
  restaurantName: null,
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart_Interface | null>) => {
      if (!action.payload) {
        state.cartId = null;
        state.restaurantId = null;
        state.items = [];
        return;
      }
      state.cartId = action.payload.id;
      state.restaurantId = action.payload.restaurantId;
      state.restaurantName = action.payload.restaurantName;
      state.items = action.payload.items;
    },

    clearCartLocal: (state) => {
      state.cartId = null;
      state.restaurantId = null;
      state.items = [];
    },
  },
});

export const { setCart, clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;