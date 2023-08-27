import { createSlice } from "@reduxjs/toolkit";

interface action {
  payload: {
    id: string;
    data: ArrayBuffer;
  };
}

const initialState: Record<string, ArrayBuffer> = {};

export const generalBattleSkeletonData = createSlice({
  name: "generalBattleSkeletonData",
  initialState,
  reducers: {
    setGeneralBattleSkeletonData: (state, action: action) => {
      state[action.payload.id] = action.payload.data;
      return state;
    },
  },
});

export const { setGeneralBattleSkeletonData } =
  generalBattleSkeletonData.actions;

export default generalBattleSkeletonData.reducer;
