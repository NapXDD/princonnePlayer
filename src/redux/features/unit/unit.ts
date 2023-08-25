import { createSlice } from "@reduxjs/toolkit";
import { UnitState } from "../../../types/character";

const initialState: UnitState = {
  id: "100111",
  animation: "idle",
  animationSpeed: "1",
  classType: "1",
};

export const unitState = createSlice({
  name: "unitState",
  initialState,
  reducers: {
    updateUnit: (state, action) => {
      return {
        ...state,
        id: action.payload.baseId,
        animation: action.payload.animation,
        animationSpeed: action.payload.animationSpeed,
        classType: action.payload.classType,
      };
    },
  },
});

export const { updateUnit } = unitState.actions;

export default unitState.reducer;
