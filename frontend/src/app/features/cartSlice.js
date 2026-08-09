import { createSlice } from "@reduxjs/toolkit";
import { addItemToShoppingCart } from "../../utils";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      state.cart = addItemToShoppingCart(action.payload, state.cart);
    },
    deleteItem(state, action) {
      state.cart = state.cart.filter(
        (item) => item.data.product.id !== action.payload
      );
    },
    incressItem(state, action) {
      const item = state.cart.find(
        (item) => item.data.product.id === action.payload
      );
      item.quantity++; // item.totalPrice = item.quantity * item.unitPrice;
    },
    decressItem(state, action) {
      const item = state.cart.find(
        (item) => item.data.product.id === action.payload
      );
      item.quantity--; // item.totalPrice = item.quantity * item.unitPrice;
      if (item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action);
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const selectTotalPrice = (state) =>
  state.cart.cart.reduce(
    (total, item) => total + item.quantity * item.data.product.price,
    0
  );

export const selectTotalDiscountedPrice = (state) =>
  state.cart.cart.reduce(
    (total, item) =>
      total +
      item.quantity *
        (item.data.product.price -
          item.data.product.price *
            (item.data.product.discountPercentage / 100)),
    0
  );

export const selectTotalQuantity = (state) =>
  state.cart.cart.reduce((total, item) => total + item.quantity, 0);

export const { addItem, deleteItem, incressItem, decressItem, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
