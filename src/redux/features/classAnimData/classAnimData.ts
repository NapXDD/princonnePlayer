import { createSlice } from "@reduxjs/toolkit";

const initialState = "1";
export const classAnimData = createSlice({
  name: "classAnimData",
  initialState,
  reducers: {
    setClassData: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setClassData } = classAnimData.actions;

export default classAnimData.reducer;
