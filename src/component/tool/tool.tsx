import { Box } from "@chakra-ui/react";
import AnimationSelector from "./animation_selector";
import CharaSelector from "./chara_selector";
import { useEffect } from "react";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
/* eslint-disable */
// @ts-ignore
import { animation } from "../../utils/animation/animation_test.js";

export default function Tool() {
  const loadingSkeleton = useSelector(
    (state: RootState) => state.loadingSkeleton
  );

  useEffect(() => {
    animation.init(loadingSkeleton);
  }, [loadingSkeleton]);

  return (
    <Box className="flex-col flex-wrap justify-center items-center">
      <CharaSelector />
      <AnimationSelector />
    </Box>
  );
}
