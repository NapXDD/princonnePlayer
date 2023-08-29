import { createSlice } from "@reduxjs/toolkit";
import { CanvasState } from "../../../types/canvas";

const initialState: CanvasState = {
  canvasBG: [],
  showNode: false,
};

export const canvasState = createSlice({
  name: "canvasState",
  initialState,
  reducers: {
    updateCanvas: (state, action) => {
      return {
        ...state,
        canvasBG: action.payload.canvasBG,
        showNode: action.payload.showNode,
      };
    },
  },
});

export const { updateCanvas } = canvasState.actions;

export default canvasState.reducer;
