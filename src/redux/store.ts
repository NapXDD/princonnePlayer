import { configureStore } from "@reduxjs/toolkit";
import unitStateReducer from "./features/unit/unit";
import canvasStateReducer from "./features/canvas/canvas";

export const store = configureStore({
  reducer: {
    unitState: unitStateReducer,
    canvasState: canvasStateReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
