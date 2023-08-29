import {
  Skeleton,
  AnimationState,
  Vector2,
} from "@esotericsoftware/spine-webgl";

export interface loadSkeleton {
  skeleton: Skeleton;
  state: AnimationState;
  bounds: { offset: Vector2; size: Vector2 };
  premultipliedAlpha: boolean;
}

type MutableSkeleton = object;

type ChangeType<T, U> = T extends object ? U : T;

export type DynamicSkeleton = ChangeType<MutableSkeleton, loadSkeleton>;

export interface skeletons {
  [code: string]: Record<"Binary", loadSkeleton>;
}
