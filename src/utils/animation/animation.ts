import { loadingSkeleton } from "./../../redux/features/spine/loadingSkeleton";
import { generalAdditionAnimations } from "./../../redux/features/generalAdditionAnimations/generalAdditionAnimations";
import { loadingSkeleton } from "../../redux/features/spine/loadingSkeleton";
import { additionAnimations } from "../../constant/additionalAnimations";
import loadData from "../loadData";
import { getBinaryFile } from "../axios/axiosGet";
import { classAnimData } from "../../redux/features/classAnimData/classAnimData";
import { UnitState } from "../../types/character";
import { charaAnimData } from "../../redux/features/charaAnimData/charaAnimData";

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

export const load = (unit_id: string, class_id: string) => {
  // const loading = useSelector((state: RootState) => state.windowLoading)
  // if(loading) return
  console.log(unit_id, class_id);
};

export const loadAdditionAnimation = (
  loadingSkeleton: loadingSkeleton,
  generalAdditionAnimations: generalAdditionAnimations[],
  classAnimData: classAnimData,
  unitState: UnitState,
  charaAnimData: charaAnimData
) => {
  let doneCount = 0;
  const baseId = loadingSkeleton.baseId;
  additionAnimations.forEach((animation) => {
    if (generalAdditionAnimations[parseInt(baseId)][parseInt(animation)])
      return doneCount++;
    loadData(
      getBinaryFile(`/assets/common/${baseId}_${animation}.cysp`),
      (responseData) => {
        if (responseData === null) {
          console.error("No data");
        } else {
          generalAdditionAnimations[parseInt(baseId)][parseInt(animation)] =
            sliceCyspAnimation(responseData);
          if (++doneCount === additionAnimations.length) {
            loadClassAnimation(
              classAnimData,
              unitState,
              charaAnimData,
              loadingSkeleton
            );
          }
        }
      }
    );
  });
  if (doneCount === additionAnimations.length)
    return loadClassAnimation(
      classAnimData,
      unitState,
      charaAnimData,
      loadingSkeleton
    );
};

export const loadClassAnimation = (
  classAnimData: classAnimData,
  unitState: UnitState,
  charaAnimData: charaAnimData,
  loadingSkeleton: loadingSkeleton
) => {
  if (classAnimData.type === unitState.classType) {
    loadCharaSkillAnimation(charaAnimData, loadingSkeleton);
  } else {
    const classData = getClass(parseInt(unitState.classType));
    loadData(
      getBinaryFile(`assets/common/${classData}_COMMON_BATTLE.cysp`),
      (responseData) => {
        if (responseData === null) {
          console.error("No data");
        } else {
          classAnimData = {
            type: unitState.classType,
            data: sliceCyspAnimation(responseData),
          };
          loadCharaSkillAnimation(charaAnimData, loadingSkeleton);
        }
      }
    );
  }
};

export const loadCharaSkillAnimation = (
  charaAnimData: charaAnimData,
  loadingSkeleton: loadingSkeleton
) => {
  let baseUnitId = loadingSkeleton.id;
  baseUnitId -= (baseUnitId % 100) - 1;
  if (charaAnimData.id == baseUnitId.toString()) {
    loadTexture();
  } else {
    loadData(
      getBinaryFile(`assets/unit/${baseUnitId}_BATTLE.cysp`),
      (responseData) => {
        charaAnimData = {
          id: baseUnitId.toString(),
          data: sliceCyspAnimation(responseData),
        };
        loadTexture();
      }
    );
  }
};

export const loadTexture = (loadingSkeleton: loadingSkeleton) => {
  loadData(
    getBinaryFile(`assets/unit/${loadingSkeleton.id}.atlas`),
    (responseData) => {
      if (responseData === null) {
        console.error("No data");
      } else {
        loadData(
          getBinaryFile(`assets/unit/${loadingSkeleton.id}.png`),
          (responseData) => {
            const img = new Image();
            img.onload = () => {
              const created = !!window.skeleton.skeleton;
              if (created) {
                window.skeleton.state.clearTracks();
                window.skeleton.state.clearListeners();
              }
            };
          }
        );
      }
    }
  );
};
