import { createSlice } from "@reduxjs/toolkit";

interface action {
  payload: {
    id: string;
    data: ArrayBuffer;
    additionType: string;
  };
}

interface additionType {
  [code: string]: ArrayBuffer;
}

const initialState: Record<string, additionType> = {};

export const generalAdditionAnimations = createSlice({
  name: "generalAdditionAnimations",
  initialState,
  reducers: {
    setGeneralAdditionAnimations: (state, action: action) => {
      state[action.payload.id] = {
        ...state[action.payload.id],
        [action.payload.additionType]: action.payload.data,
      };
      return state;
    },
  },
});

export const { setGeneralAdditionAnimations } =
  generalAdditionAnimations.actions;

export default generalAdditionAnimations.reducer;
