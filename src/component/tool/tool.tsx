import { Box } from "@chakra-ui/react";
import AnimationSelector from "./animation_selector";
import CharaSelector from "./chara_selector";
import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
/* eslint-disable */
// @ts-ignore
import { animation } from "../../utils/animation/animation_test.js";

export default function Tool() {
  const loadingSkeleton = useSelector(
    (state: RootState) => state.loadingSkeleton
  );

  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoadData = async () => {
    await animation.loadDefaultAdditionAnimation();
  };

  useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(true);
      handleLoadData();
    }
    animation.init(loadingSkeleton);
  }, [loadingSkeleton]);

  return (
    <Box className="flex-col flex-wrap justify-center items-center">
      <CharaSelector />
      <AnimationSelector />
    </Box>
  );
}
