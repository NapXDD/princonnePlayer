import { charaType } from "./../../../types/character";
import { createSlice } from "@reduxjs/toolkit";

interface loadingSkeleton {
  id: number;
  info: charaType;
  baseId: "000000";
}

const initialState: loadingSkeleton = {
  id: 0,
  info: {
    name: "",
    type: "",
    hasRarity6: false,
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
