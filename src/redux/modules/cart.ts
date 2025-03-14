import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book } from "../../types/book";
import { CartState } from "../../types/cart";

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Book>) {
      return { ...state, items: [...state.items, action.payload] };
    },
    clearCart(state) {
      return { ...state, items: [] };
    },
    setCartItems(state, action: PayloadAction<Book[]>) {
      return { ...state, items: action.payload };
    },
  },
});

export const { addToCart, clearCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
