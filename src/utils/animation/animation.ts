import loadData from "../loadData";
import { getBinaryFile } from "../axios/axiosGet";
import { store } from "../../redux/store";
import { additionAnimations } from "./../../constant/additionalAnimations";
import { setGeneralAdditionAnimations } from "../../redux/features/generalAdditionAnimations/generalAdditionAnimations";
import { setCharaData } from "../../redux/features/charaAnimData/charaAnimData";
import { setClassData } from "../../redux/features/classAnimData/classAnimData";
import { setGeneralBattleSkeletonData } from "../../redux/features/generalBattleSkeletonData/generalBattleSkeletonData";

const generalAdditionAnimations = store.getState().generalAdditionAnimations;
const unitState = store.getState().unitState;
const classAnimData = store.getState().classAnimData;
const charaAnimData = store.getState().charaAnimation;
const loadingSkeleton = store.getState().loadingSkeleton;
const generalBattleSkeonData = store.getState().generalBattleSkeonData;
const dispatch = store.dispatch;

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

export const loadDefaultCharaBaseData = async () => {
  const baseId = "000000";
  const response = await getBinaryFile(
    `assets/common/${baseId}_CHARA_BASE.cysp`
  );
  if (response.data === null) {
    console.error("No data");
    return;
  }
  const data = {
    id: baseId,
    data: response.data,
  };
  dispatch(setGeneralBattleSkeletonData(data));
};

export const loadDefaultAdditionalAnimation = () => {
  const baseId = "000000";
  additionAnimations.map(async (animation) => {
    const response = await getBinaryFile(
      `assets/common/${baseId}_${animation.type}.cysp`
    );
    const data = {
      id: baseId,
      data: response.data,
      additionType: animation.type,
    };
    dispatch(setGeneralAdditionAnimations(data));
  });
};

export const load = async () => {
  // const loading = useSelector((state: RootState) => state.windowLoading)
  // if(loading) return

  const baseId = parseInt(loadingSkeleton.baseId);
  console.log(baseId);
  if (Object.keys(generalBattleSkeonData)[baseId].length === 0) {
    const response = await getBinaryFile(
      `assets/common/${baseId}_CHARA_BASE.cysp`
    );
    if (response.data === null) {
      console.error("No data");
      return;
    }
    dispatch(setGeneralBattleSkeletonData(response.data));
    // loadAdditionAnimation();
  }
};

export const loadAdditionAnimation = () => {
  let doneCount = 0;
  const loadingSkeleton = store.getState().loadingSkeleton;
  const baseId = loadingSkeleton.baseId;
  additionAnimations.forEach(async (animation) => {
    if (generalAdditionAnimations[parseInt(baseId)][animation.value])
      return doneCount++;
    const request = await getBinaryFile(
      `/assets/common/${baseId}_${animation}.cysp`
    );
    if (request.data === null) {
      console.error("No data");
    } else {
      console.log(request);
      // store.dispatch(
      //   setGeneralAdditionAnimations(sliceCyspAnimation(request.data))
      // );
      // if (++doneCount === additionAnimations.length) {
      //   loadClassAnimation(
      //     classAnimData,
      //     unitState,
      //     charaAnimData,
      //     loadingSkeleton
      //   );
      // }
    }
  });
  if (doneCount === additionAnimations.length) return loadClassAnimation();
};

export const loadClassAnimation = () => {
  if (classAnimData.type === unitState.classType) {
    loadCharaSkillAnimation();
  } else {
    const classData = getClass(parseInt(unitState.classType));
    loadData(
      getBinaryFile(`assets/common/${classData}_COMMON_BATTLE.cysp`),
      (responseData) => {
        if (responseData === null) {
          console.error("No data");
        } else {
          const data = {
            type: unitState.classType,
            data: sliceCyspAnimation(responseData),
          };
          store.dispatch(setClassData(data));
          loadCharaSkillAnimation();
        }
      }
    );
  }
};

export const loadCharaSkillAnimation = () => {
  let baseUnitId = loadingSkeleton.id;
  baseUnitId -= (baseUnitId % 100) - 1;
  if (charaAnimData.id == baseUnitId.toString()) {
    loadTexture();
  } else {
    loadData(
      getBinaryFile(`assets/unit/${baseUnitId}_BATTLE.cysp`),
      (responseData) => {
        const data = {
          id: baseUnitId.toString(),
          data: sliceCyspAnimation(responseData),
        };
        store.dispatch(setCharaData(data));

        loadTexture();
      }
    );
  }
};

export const loadTexture = () => {};
