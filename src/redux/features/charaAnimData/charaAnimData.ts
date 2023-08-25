import { createSlice } from "@reduxjs/toolkit";

export interface charaAnimData {
  id: string;
  data: object;
}

const initialState: charaAnimData = {
  id: "0",
  data: {},
};
export const charaAnimation = createSlice({
  name: "charaAnimation",
  initialState,
  reducers: {
    setCharaData: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setCharaData } = charaAnimation.actions;

export default charaAnimation.reducer;
