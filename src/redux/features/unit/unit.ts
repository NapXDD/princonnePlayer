import { createSlice } from "@reduxjs/toolkit";
import { UnitState } from "../../../types/character";

const initialState: UnitState = {
  baseId: "100111",
  animation: "idle",
  animationSpeed: "1",
  weaponType: "1",
};

export const unitState = createSlice({
  name: "unitState",
  initialState,
  reducers: {
    updateUnit: (state, action) => {
      return {
        ...state,
        baseId: action.payload.baseId,
        animation: action.payload.animation,
        animationSpeed: action.payload.animationSpeed,
        weaponType: action.payload.weaponType,
      };
    },
  },
});

export const { updateUnit } = unitState.actions;

export default unitState.reducer;
