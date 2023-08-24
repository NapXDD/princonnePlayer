import { createSlice } from "@reduxjs/toolkit";

type activeSkeleton = string;
const initialState: activeSkeleton = "";

export const activeSkeleton = createSlice({
  name: "activeSkeleton",
  initialState,
  reducers: {
    setActiveSkeleton: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setActiveSkeleton } = activeSkeleton.actions;

export default activeSkeleton.reducer;
