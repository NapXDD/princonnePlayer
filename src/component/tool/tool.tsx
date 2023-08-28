import { Box } from "@chakra-ui/react";
import AnimationSelector from "./animation_selector";
import CharaSelector from "./chara_selector";
import { useEffect } from "react";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { animation } from "../../utils/animation/animation";

export default function Tool() {
  const loadingSkeleton = useSelector(
    (state: RootState) => state.loadingSkeleton
  );
  const unitState = useSelector((state: RootState) => state.unitState);

  const generalBattleSkeletonData = useSelector(
    (state: RootState) => state.generalBattleSkeonData
  );

  const generalAdditionAnimations = useSelector(
    (state: RootState) => state.generalAdditionAnimations
  );

  useEffect(() => {}, []);

  useEffect(() => {
    animation.loadTexture();
  }, [loadingSkeleton, unitState]);

  return (
    <Box className="flex-col flex-wrap justify-center items-center">
      <CharaSelector />
      <AnimationSelector />
    </Box>
  );
}
