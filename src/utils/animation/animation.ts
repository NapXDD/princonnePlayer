import { GLTexture } from "@";
import { getBinaryFile, getBlobFile } from "../axios/axiosGet";
import { store } from "../../redux/store";
import { additionAnimations } from "./../../constant/additionalAnimations";
import {
  GLTexture,
  TextureAtlas,
  AtlasAttachmentLoader,
  Skeleton,
  SkeletonBinary,
  Vector2,
  AnimationStateData,
  AnimationState,
} from "@esotericsoftware/spine-webgl";

export const getClass = (i: string) => {
  return (parseInt(i) < 10 ? "0" : "") + i;
};

interface sliceCyspType {
  count: number;
  data: ArrayBuffer;
}

interface additionType {
  [code: string]: sliceCyspType;
}

interface classAnimData {
  type: string;
  data: sliceCyspType;
}

interface charaAnimData {
  id: string;
  data: sliceCyspType;
}

interface bounds {
  offset: Vector2;
  size: Vector2;
}

export class animation {
  static generalBattleSkeletonData: Record<string, ArrayBuffer> = {};
  static generalAdditionAnimations: Record<string, additionType> = {};
  static currentCharaAnimData: charaAnimData = {
    id: "0",
    data: { count: 0, data: new Uint8Array([0]) },
  };
  static currentClassAnimData: classAnimData = {
    type: "0",
    data: { count: 0, data: new Uint8Array([0]) },
  };
  static skeleton: {
    skeleton: Skeleton | [];
    state: bounds | [];
    bounds: AnimationState | [];
    premultipliedAlpha: boolean;
  } = { skeleton: [], state: [], bounds: [], premultipliedAlpha: true };
  static animationQueue: string[] = [];
  static currentTexture: GLTexture;
  static gl;

  protected static sliceCyspAnimation(buffer: ArrayBuffer): sliceCyspType {
    const view = new DataView(buffer);
    const count = view.getInt32(12, true);
    return {
      count: count,
      data: buffer.slice((count + 1) * 32),
    };
  }

  protected static setGeneralBattleSkeletonData(data: {
    id: string;
    data: ArrayBuffer;
  }) {
    animation.generalBattleSkeletonData[data.id] = data.data;
  }

  protected static setGeneralAdditionAnimationData(data: {
    id: string;
    type: string;
    data: {
      count: number;
      data: ArrayBuffer;
    };
  }) {
    animation.generalAdditionAnimations[data.id] = {
      ...animation.generalAdditionAnimations[data.id],
      [data.type]: data.data,
    };
  }

  protected static setCurrentClasAnimData(data: {
    type: string;
    data: sliceCyspType;
  }) {
    animation.currentClassAnimData = {
      type: data.type,
      data: data.data,
    };
  }

  protected static setCurrentCharaAnimData(data: {
    id: string;
    data: sliceCyspType;
  }) {
    animation.currentCharaAnimData = {
      id: data.id,
      data: data.data,
    };
  }

  static async loadDefaultCharaBaseData() {
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
    animation.setGeneralBattleSkeletonData(data);
  }

  static loadDefaultAdditionAnimation() {
    const baseId = "000000";
    additionAnimations.map(async (item) => {
      const response = await getBinaryFile(
        `assets/common/${baseId}_${item.type}.cysp`
      );
      const data = {
        id: baseId,
        data: animation.sliceCyspAnimation(response.data),
        type: item.type,
      };
      animation.setGeneralAdditionAnimationData(data);
    });
  }

  static async loadCharaBaseData() {
    const loadingSkeleton = store.getState().loadingSkeleton;
    const baseId = loadingSkeleton.baseId;
    const response = await getBinaryFile(
      `assets/common/${baseId}_CHARA_BASE.cysp`
    );
    if (response.status !== 200) {
      console.error(`${baseId}_CHARA_BASE.cysp not exist`);
      return;
    }
    const data = {
      id: baseId,
      data: response.data,
    };
    animation.setGeneralBattleSkeletonData(data);
  }

  static loadAdditionAnimation() {
    let doneCount = 0;
    const loadingSkeleton = store.getState().loadingSkeleton;
    const baseId = loadingSkeleton.baseId;
    additionAnimations.map(async (additionAnimation) => {
      if (animation.generalAdditionAnimations[baseId][additionAnimation.type])
        return doneCount++;
      const response = await getBinaryFile(
        `assets/common/${baseId}_${additionAnimation.type}.cysp`
      );
      if (response.status !== 200) {
        console.error(`${baseId}_${additionAnimation.type}.cysp not exist`);
        return;
      }
      const data = {
        id: baseId,
        data: animation.sliceCyspAnimation(response.data),
        type: additionAnimation.type,
      };
      animation.setGeneralAdditionAnimationData(data);
    });
    if (doneCount === additionAnimations.length)
      return animation.loadClassAnimation();
  }

  static async loadClassAnimation() {
    const currentClass = store.getState().classAnimData;
    if (currentClass === animation.currentClassAnimData.type) {
      animation.loadCharaSkillAnimation();
    } else {
      const response = await getBinaryFile(
        `assets/common/${getClass(currentClass)}_COMMON_BATTLE.cysp`
      );
      if (response.status !== 200) {
        console.error(`${getClass(currentClass)}_COMMON_BATTLE.cysp not exist`);
        return;
      }
      const data = {
        type: currentClass,
        data: animation.sliceCyspAnimation(response.data),
      };
      animation.setCurrentClasAnimData(data);
      animation.loadCharaBaseData();
    }
  }

  static async loadCharaSkillAnimation() {
    const loadingSkeleton = store.getState().loadingSkeleton;
    const baseUnitId = loadingSkeleton.baseId;
    if (animation.currentCharaAnimData.id === baseUnitId)
      animation.loadTexture();
    else {
      const response = await getBinaryFile(
        `assets/unit/${baseUnitId}_BATTLE.cysp`
      );
      if (response.status !== 200) {
        console.error(`${baseUnitId}_BATTLE.cysp not exist`);
        return;
      }
      const data = {
        id: baseUnitId,
        data: animation.sliceCyspAnimation(response.data),
      };
      animation.setCurrentCharaAnimData(data);
      animation.loadTexture();
    }
  }

  static async loadTexture() {
    const loadingSkeleton = store.getState().loadingSkeleton;
    const response = await getBlobFile(
      `assets/unit/${loadingSkeleton.id}.atlas`
    );
    if (response.status !== 200) {
      console.error(`${loadingSkeleton.id}.atlas not exist`);
      return;
    }
    const pngResponse = await getBlobFile(
      `assets/unit/${loadingSkeleton.id}.png`
    );
    if (pngResponse.status !== 200) {
      console.error(`${loadingSkeleton.id}.png not exist`);
      return;
    }
    const atlasText = await new Response(response.data).text();
    const img = new Image();
    img.onload = () => {
      const created = !!animation.skeleton.skeleton;
      if (created) {
        animation.skeleton.skeleton.state.clearTracks();
        animation.skeleton.skeleton.state.clearListeners();
        animation.gl.deleteTexture(animation.currentTexture.texture);
      }
      const imgTexture = new GLTexture(animation.gl, img);
      URL.revokeObjectURL(img.src);
      const atlas = new TextureAtlas(atlasText);
      animation.currentTexture = imgTexture;
      const atlasLoader = new AtlasAttachmentLoader(atlas);
      const baseId = loadingSkeleton.baseId;
      const additionAnimations = Object.values(
        animation.generalAdditionAnimations[baseId]
      );

      let animationCount = 0;
      const classAnimCount = animation.currentClassAnimData.data.count;
      animationCount += classAnimCount;
      const unitAnimCount = animation.currentCharaAnimData.data.count;
      animationCount += unitAnimCount;
      additionAnimations.forEach((i) => {
        animationCount += i.count;
      });

      //assume always no more than 128 animations
      let newBuffSize =
        animation.generalBattleSkeletonData[baseId].byteLength -
        64 +
        1 +
        animation.currentClassAnimData.data.data.byteLength +
        animation.currentCharaAnimData.data.data.byteLength;
      additionAnimations.forEach((i) => {
        newBuffSize += i.data.byteLength;
      });

      const newBuff = new Uint8Array(newBuffSize);
      let offset = 0;
      newBuff.set(
        new Uint8Array(animation.generalBattleSkeletonData[baseId].slice(64)),
        0
      );

      offset += this.generalBattleSkeletonData[baseId].byteLength - 64;
      newBuff[offset] = animationCount;
      offset++;

      newBuff.set(
        new Uint8Array(animation.currentClassAnimData.data.data),
        offset
      );

      offset += animation.currentClassAnimData.data.data.byteLength;
      newBuff.set(
        new Uint8Array(animation.currentCharaAnimData.data.data),
        offset
      );
      offset += animation.currentCharaAnimData.data.data.byteLength;

      additionAnimations.forEach((i) => {
        newBuff.set(new Uint8Array(i.data), offset);
        offset += i.data.byteLength;
      });

      const skeletonBinary = new SkeletonBinary(atlasLoader);
      const skeletonData = skeletonBinary.readSkeletonData(newBuff);
      const currentSkelData = newBuff.buffer;
      const skeleton = new Skeleton(skeletonData);
      skeleton.setSkinByName("default");
      const bounds = animation.calculateBounds(skeleton);

      const animationStateData = new AnimationStateData(skeleton.data);

      const animationState = new AnimationState(animationStateData);
      //console.log(getClass())
      animationState.addListener({
        complete: function tick() {
          if (animation.animationQueue.length) {
            let nextAnim = animation.animationQueue.shift() as string;
            if (nextAnim === "stop") return;
            if (nextAnim === "hold") return setTimeout(tick, 1e3);
            if (nextAnim.substring(0, 1) != "1") {
              nextAnim = `${getClass(
                animation.currentClassAnimData.type
              )}_${nextAnim}`;
            }
            animationState.setAnimation(
              0,
              nextAnim,
              !animation.animationQueue.length
            );
          }
        },
      });
      animation.skeleton = {
        skeleton: skeleton,
        state: animationState,
        bounds: bounds,
        premultipliedAlpha: true,
      };
    };
  }

  static calculateBounds(skeleton: Skeleton) {
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform();
    const offset = new Vector2();
    const size = new Vector2();
    skeleton.getBounds(offset, size, []);
    return { offset: offset, size: size };
  }
}
