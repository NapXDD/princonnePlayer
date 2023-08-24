import { charactersType } from "./../../../types/character";
import { createSlice } from "@reduxjs/toolkit";

const initialState: charactersType = {};

export const classMap = createSlice({
  name: "classMap",
  initialState,
  reducers: {
    setClassMap: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setClassMap } = classMap.actions;

export default classMap.reducer;
