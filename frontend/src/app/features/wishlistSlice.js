import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlist: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addItem(state, action) {
      state.wishlist.push(action.payload);
    },
    deleteItem(state, action) {
      state.wishlist = state.wishlist.filter(
        (item) => item.data.product.id !== action.payload
      );
    },

    clearWishlist(state) {
      state.wishlist = [];
    },
  },
});

export const { addItem, deleteItem, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
