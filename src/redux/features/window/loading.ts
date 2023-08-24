import { createSlice } from "@reduxjs/toolkit";

const initialState: boolean = false;

export const windowLoading = createSlice({
  name: "windowLoading",
  initialState,
  reducers: {
    updateWindowLoading: () => {
      return !initialState;
    },
  },
});

export const { updateWindowLoading } = windowLoading.actions;

export default windowLoading.reducer;
