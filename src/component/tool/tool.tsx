import { Box } from "@chakra-ui/react";
import AnimationSelector from "./animation_selector";
import CharaSelector from "./chara_selector";

export default function Tool() {
  return (
    <Box className="flex-col flex-wrap justify-center items-center">
      <CharaSelector />
      <AnimationSelector />
    </Box>
  );
}
