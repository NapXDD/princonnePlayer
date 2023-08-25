import { createSlice } from "@reduxjs/toolkit";

export interface generalAdditionAnimations {
  [code: number]: object;
}

const initialState: generalAdditionAnimations = [{}];

export const generalAdditionAnimations = createSlice({
  name: "generalAdditionAnimations",
  initialState,
  reducers: {
    setGeneralAdditionAnimations: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setGeneralAdditionAnimations } =
  generalAdditionAnimations.actions;

export default generalAdditionAnimations.reducer;
