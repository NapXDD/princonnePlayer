import { loadingSkeleton } from "./../../redux/features/spine/loadingSkeleton";
import { canvasState } from "./../../redux/features/canvas/canvasState";
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
  ManagedWebGLRenderingContext,
  Matrix4,
  Shader,
  PolygonBatcher,
  SkeletonRenderer,
  SkeletonDebugRenderer,
  ShapeRenderer,
  AssetManager,
  AssetManagerBase,
  Texture,
} from "@esotericsoftware/spine-webgl";
import { DynamicSkeleton } from "../../types/skeleton";

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
  static skeleton: DynamicSkeleton = {};
  static animationQueue: string[] = [];
  static currentTexture: GLTexture;
  static ctx: ManagedWebGLRenderingContext;
  static lastFrameTime: number = Date.now() / 1000;
  static speedFactor = 1;
  static canvas: HTMLCanvasElement;
  static mvp: Matrix4 = new Matrix4();
  static shader: Shader;
  static batcher: PolygonBatcher;
  static skeletonRenderer: SkeletonRenderer;
  static debugRenderer: SkeletonDebugRenderer;
  static debugShader: Shader;
  static shapes: ShapeRenderer;
  static assetManager: AssetManager;

  static init(loadingSkeleton: loadingSkeleton) {
    animation.canvas = document.getElementById("player") as HTMLCanvasElement;
    animation.canvas.width = window.innerWidth;
    animation.canvas.height = window.innerHeight;
    const config = { alpha: false };
    animation.ctx = new ManagedWebGLRenderingContext(animation.canvas, config);
    animation.shader = Shader.newTwoColoredTextured(animation.ctx);
    animation.batcher = new PolygonBatcher(animation.ctx);
    animation.mvp.ortho2d(
      0,
      0,
      animation.canvas.width - 1,
      animation.canvas.height - 1
    );
    animation.skeletonRenderer = new SkeletonRenderer(animation.ctx);
    animation.assetManager = new AssetManager(
      animation.ctx,
      "Data/assets/unit/"
    );

    animation.debugRenderer = new SkeletonDebugRenderer(animation.ctx);
    const debugRenderer = animation.debugRenderer;
    debugRenderer.drawRegionAttachments = true;
    debugRenderer.drawBoundingBoxes = true;
    debugRenderer.drawMeshHull = true;
    debugRenderer.drawMeshTriangles = true;
    debugRenderer.drawPaths = true;

    animation.debugShader = Shader.newColored(animation.ctx);
    animation.shapes = new ShapeRenderer(animation.ctx);

    animation.assetManager.loadTextureAtlas(`${loadingSkeleton.id}.atlas`);

    requestAnimationFrame(load);

    function load() {
      if (animation.assetManager.isLoadingComplete()) {
        animation.loadDefaultAdditionAnimation();
        animation.loadCharaBaseData(loadingSkeleton);
        animation.lastFrameTime = Date.now() / 1000;
        // requestAnimationFrame(animation.render);
      } else requestAnimationFrame(load);
    }
  }

  protected static sliceCyspAnimation(buffer: ArrayBuffer): sliceCyspType {
    const view = new DataView(buffer);
    const count = view.getInt32(12, true);
    return {
      count: count,
      data: buffer.slice((count + 1) * 32),
    };
  }

  protected static setSpeedFactor(value: string) {
    animation.speedFactor = parseFloat(value);
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

  static async loadCharaBaseData(loadingSkeleton: loadingSkeleton) {
    const baseId = loadingSkeleton.baseId;
    if (animation.generalBattleSkeletonData[baseId] === undefined) {
      try {
        const response = await getBinaryFile(
          `assets/common/${baseId}_CHARA_BASE.cysp`
        );
        if (response.status === 200) {
          const data = {
            id: baseId,
            data: response.data,
          };
          animation.setGeneralBattleSkeletonData(data);
          animation.loadAdditionAnimation(loadingSkeleton);
        }
      } catch {
        animation.loadAdditionAnimation(loadingSkeleton);
      }
    } else {
      animation.loadAdditionAnimation(loadingSkeleton);
    }
  }

  static loadAdditionAnimation(loadingSkeleton: loadingSkeleton) {
    let doneCount = 0;
    const baseId = loadingSkeleton.baseId;
    animation.generalAdditionAnimations[baseId] =
      animation.generalAdditionAnimations[baseId] || {};
    additionAnimations.map(async (additionAnimation) => {
      console.log(doneCount);
      if (animation.generalAdditionAnimations[baseId][additionAnimation.type]) {
        return doneCount++;
      }

      const response = await getBinaryFile(
        `assets/common/${baseId}_${additionAnimation.type}.cysp`
      );
      const data = {
        id: baseId,
        data: animation.sliceCyspAnimation(response.data),
        type: additionAnimation.type,
      };
      animation.setGeneralAdditionAnimationData(data);
      animation.loadClassAnimation();
      // animation.loadClassAnimation();

      if (++doneCount === additionAnimations.length)
        animation.loadClassAnimation();
    });
    console.log("lmao", animation.generalAdditionAnimations);
    if (doneCount === additionAnimations.length) animation.loadClassAnimation();
  }

  static async loadClassAnimation() {
    const currentClass = store.getState().classAnimData;
    if (currentClass === animation.currentClassAnimData.type) {
      animation.loadCharaSkillAnimation();
    } else {
      try {
        const response = await getBinaryFile(
          `assets/common/${getClass(currentClass)}_COMMON_BATTLE.cysp`
        );
        if (response.status === 200) {
          const data = {
            type: currentClass,
            data: animation.sliceCyspAnimation(response.data),
          };
          animation.setCurrentClasAnimData(data);
          animation.loadCharaSkillAnimation();
          console.log("classSkillAnimation:", animation.currentClassAnimData);
        }
      } catch {
        animation.loadCharaSkillAnimation();
      }
    }
  }

  static async loadCharaSkillAnimation() {
    const loadingSkeleton = store.getState().loadingSkeleton;
    let baseUnitId = loadingSkeleton.id;
    baseUnitId -= (baseUnitId % 100) - 1;
    if (parseInt(animation.currentCharaAnimData.id) === baseUnitId) {
      animation.loadTexture();
    } else {
      try {
        const response = await getBinaryFile(
          `assets/unit/${baseUnitId}_BATTLE.cysp`
        );
        const data = {
          id: baseUnitId.toString(),
          data: animation.sliceCyspAnimation(response.data),
        };
        animation.setCurrentCharaAnimData(data);
        animation.loadTexture();
        console.log("charaSkillAnimation:", data.data);
      } catch {
        animation.loadTexture();
      }
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
    // const atlasText = await new Response(response.data).text();
    const img = new Image();
    img.onload = () => {
      const created = !!animation.skeleton.skeleton;
      if (created) {
        animation.skeleton.state.clearTracks();
        animation.skeleton.state.clearListeners();
        animation.ctx.gl.deleteTexture(animation.currentTexture.context);
      }
      const imgTexture = new GLTexture(animation.ctx.gl, img);
      URL.revokeObjectURL(img.src);
      // const atlas = new TextureAtlas(atlasText);
      const atlas = animation.assetManager.require(
        `${loadingSkeleton.id}.atlas`
      );
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

      offset += animation.generalBattleSkeletonData[baseId].byteLength - 64;
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
      skeletonBinary.scale = 1;
      console.log(newBuff);
      const skeletonData = skeletonBinary.readSkeletonData(newBuff);
      const skeleton = new Skeleton(skeletonData);
      skeleton.setSkinByName("default");
      const bounds = animation.calculateBounds(skeleton);

      const animationStateData = new AnimationStateData(skeleton.data);

      const animationState = new AnimationState(animationStateData);
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
    img.src = URL.createObjectURL(pngResponse.data);
  }

  static calculateBounds(skeleton: Skeleton) {
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform();
    const offset = new Vector2();
    const size = new Vector2();
    skeleton.getBounds(offset, size, []);
    return { offset: offset, size: size };
  }

  static render() {
    const now = Date.now() / 1000;
    const canvasState = store.getState().canvasState;
    let delta = now - animation.lastFrameTime;
    animation.lastFrameTime = now;
    delta *= animation.speedFactor;

    // Update the MVP matrix to adjust for canvas size changes
    animation.resize();

    const gl = animation.ctx.gl;
    gl.clearColor(
      parseInt(canvasState.canvasBG[0]),
      parseInt(canvasState.canvasBG[1]),
      parseInt(canvasState.canvasBG[2]),
      1
    );
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Apply the animation state based on the delta time.
    const state = animation.skeleton.state;
    const skeleton = animation.skeleton.skeleton;
    const bounds = animation.skeleton.bounds;
    const premultipliedAlpha = animation.skeleton.premultipliedAlpha;
    state.update(delta);
    state.apply(skeleton);
    skeleton.updateWorldTransform();

    // Bind the shader and set the texture and model-view-projection matrix.
    animation.shader.bind();
    animation.shader.setUniformi(Shader.SAMPLER, 0);
    animation.shader.setUniform4x4f(Shader.MVP_MATRIX, animation.mvp.values);

    // Start the batch and tell the SkeletonRenderer to render the active skeleton.
    animation.batcher.begin(animation.shader);

    const skeletonRenderer = animation.skeletonRenderer;
    skeletonRenderer.premultipliedAlpha = premultipliedAlpha;
    skeletonRenderer.draw(animation.batcher, skeleton);

    animation.shader.unbind();
    requestAnimationFrame(animation.render);
    // draw debug information
  }

  static resize() {
    // const useBig = screen.width * devicePixelRatio > 1280;
    const canvas = animation.canvas;
    const bounds = animation.skeleton.bounds;
    const w = canvas.clientWidth * devicePixelRatio;
    const h = canvas.clientHeight * devicePixelRatio;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    //magic resize
    const centerX = bounds.offset.x + bounds.size.x / 2;
    const centerY = bounds.offset.y + bounds.size.y / 2;
    const scaleX = bounds.size.x / canvas.width;
    const scaleY = bounds.size.y / canvas.height;
    let scale = Math.max(scaleX, scaleY) * 1.2;
    if (scale < 1) scale = 1;
    const width = canvas.width * scale;
    const height = canvas.height * scale;

    animation.mvp.ortho2d(
      centerX - width / 2,
      centerY - height / 2,
      width,
      height
    );
    animation.ctx.gl.viewport(0, 0, canvas.width, canvas.height);
  }
}
