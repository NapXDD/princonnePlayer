import { createSlice } from "@reduxjs/toolkit";

export interface classAnimData {
  type: string;
  data: object;
}

const initialState: classAnimData = {
  type: "0",
  data: {},
};
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
