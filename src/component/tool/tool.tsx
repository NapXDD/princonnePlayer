import { Box } from "@chakra-ui/react";
import AnimationSelector from "./animation_selector";
import CharaSelector from "./chara_selector";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { load, loadAdditionAnimation } from "../../utils/animation/animation";
import { RootState } from "../../redux/store";
import loadData from "../../utils/loadData";
import { getBinaryFile } from "../../utils/axios/axiosGet";
import { setGeneralBattleSkeletonData } from "../../redux/features/generalBattleSkeletonData/generalBattleSkeletonData";

export default function Tool() {
  const loadingSkeleton = useSelector(
    (state: RootState) => state.loadingSkeleton
  );
  const unitState = useSelector((state: RootState) => state.unitState);

  const generalBattleSkeleton = useSelector(
    (state: RootState) => state.generalBattleSkeonData
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const baseId = loadingSkeleton.baseId;
    if (!generalBattleSkeleton[parseInt(baseId)]) {
      loadData(
        getBinaryFile(`assets/common/${baseId}_CHARA_BASE.cysp`),
        (responseData) => {
          if (responseData === null) {
            console.error("No data");
          } else {
            dispatch(setGeneralBattleSkeletonData(responseData));
            loadAdditionAnimation()
          }
        }
      );
    }
    load(loadingSkeleton.baseId, loadingSkeleton.info.type);
  }, [loadingSkeleton, unitState]);

  return (
    <Box className="flex-col flex-wrap justify-center items-center">
      <CharaSelector />
      <AnimationSelector />
    </Box>
  );
}
