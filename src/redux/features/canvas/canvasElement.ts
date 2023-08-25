import { createSlice } from "@reduxjs/toolkit";

const initialState = document.createElement("canvas");

export const canvasElement = createSlice({
  name: "canvasElement",
  initialState,
  reducers: {
    setCanvas: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setCanvas } = canvasElement.actions;

export default canvasElement.reducer;
