import { configureStore } from "@reduxjs/toolkit";
import unitStateReducer from "./features/unit/unit";
import canvasStateReducer from "./features/canvas/canvasState";
import loadingSkeletonReducer from "./features/spine/loadingSkeleton";
import windowLoadingReducer from "./features/window/loading";
import classMapReducer from "./features/classMap/classMap";
import classAnimDataReducer from "./features/classAnimData/classAnimData";
import charaAnimationReducer from "./features/charaAnimData/charaAnimData";
import generalAdditionAnimationsReducer from "./features/generalAdditionAnimations/generalAdditionAnimations";
import generalBattleSkeonDataReducer from "./features/generalBattleSkeletonData/generalBattleSkeletonData";

export const store = configureStore({
  reducer: {
    unitState: unitStateReducer,
    canvasState: canvasStateReducer,
    loadingSkeleton: loadingSkeletonReducer,
    windowLoading: windowLoadingReducer,
    classMap: classMapReducer,
    classAnimData: classAnimDataReducer,
    charaAnimation: charaAnimationReducer,
    generalAdditionAnimations: generalAdditionAnimationsReducer,
    generalBattleSkeonData: generalBattleSkeonDataReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
