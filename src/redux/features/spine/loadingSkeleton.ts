import { charaType } from "./../../../types/character";
import { createSlice } from "@reduxjs/toolkit";

export interface loadingSkeleton {
  id: number;
  info: charaType;
  baseId: string;
}

const initialState: loadingSkeleton = {
  id: 100111,
  info: {
    name: "ヒヨリ",
    type: "1",
    hasRarity6: true,
  },
  baseId: "000000",
};

export const loadingSkeleton = createSlice({
  name: "loadingSkeleton",
  initialState,
  reducers: {
    updateLoadingSkeleton: (state, action) => {
      return {
        ...state,
        id: action.payload.id,
        info: action.payload.info,
        baseId: action.payload.baseId,
      };
    },
  },
});

export const { updateLoadingSkeleton } = loadingSkeleton.actions;

export default loadingSkeleton.reducer;
