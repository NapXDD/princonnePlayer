import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const sliceCyspAnimation = (buffer: ArrayBuffer) => {
  const view = new DataView(buffer);
  const count = view.getInt32(12, true);
  return {
    count: count,
    data: buffer.slice((count + 1) * 32),
  };
};

export const getClass = (i: number) => {
  return (i < 10 ? "0" : "") + i;
};

export const load = (
  unit_id: string,
  activeSkeletonId: string,
  class_id: string
) => {
  // const loading = useSelector((state: RootState) => state.windowLoading)
  // if(loading) return
  if (unit_id === activeSkeleton.id) {
  }
};
