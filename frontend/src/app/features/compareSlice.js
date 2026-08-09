import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  compare: [],
};

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    addItemToCompare(state, action) {
      state.compare.push(action.payload);
    },
    deleteItemFromCompare(state, action) {
      state.compare = state.compare.filter(
        (item) => item.data.product.id !== action.payload
      );
    },
    clearCompare(state) {
      state.compare = [];
    },
  },
});

export const { addItemToCompare, deleteItemFromCompare, clearCompare } =
  compareSlice.actions;
export default compareSlice.reducer;
