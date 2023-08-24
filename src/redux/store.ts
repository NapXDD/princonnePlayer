import { configureStore } from "@reduxjs/toolkit";
import unitStateReducer from "./features/unit/unit";
import canvasStateReducer from "./features/canvas/canvas";
import loadingSkeletonReducer from "./features/spine/loadingSkeleton";
import windowLoadingReducer from "./features/window/loading";
import classMapReducer from "./features/classMap/classMap";

export const store = configureStore({
  reducer: {
    unitState: unitStateReducer,
    canvasState: canvasStateReducer,
    loadingSkeleton: loadingSkeletonReducer,
    windowLoading: windowLoadingReducer,
    classMap: classMapReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
