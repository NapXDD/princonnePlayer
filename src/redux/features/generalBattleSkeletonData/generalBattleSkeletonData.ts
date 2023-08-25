import { createSlice } from "@reduxjs/toolkit";

interface generalBattleSkeletonData {
  [code: number]: object;
}
const initialState: generalBattleSkeletonData[] = [{}];

export const generalBattleSkeletonData = createSlice({
  name: "generalBattleSkeletonData",
  initialState,
  reducers: {
    setGeneralBattleSkeletonData: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setGeneralBattleSkeletonData } =
  generalBattleSkeletonData.actions;

export default generalBattleSkeletonData.reducer;
