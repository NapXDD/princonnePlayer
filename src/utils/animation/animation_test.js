import { additionAnimations } from "../../constant/additionalAnimations";
import { store } from "../../redux/store";
import { getBinaryFile, getBlobFile } from "../axios/axiosGet";

const getClass = (i) => {
  return (parseInt(i) < 10 ? "0" : "") + i;
};

export class animation {
  static generalBattleSkeletonData = {};
  static generalAdditionAnimations = {};
  static currentCharaAnimData = {
    id: "0",
    data: { count: 0, data: new Uint8Array([0]) },
  };
  static currentClassAnimData = {
    type: "0",
    data: { count: 0, data: new Uint8Array([0]) },
  };
  static skeleton = {};
  static animationQueue = [];
  static currentTexture;
  static ctx;
  static lastFrameTime = Date.now() / 1000;
  static speedFactor = 1;
  static canvas;
  // eslint-disable-next-line no-undef
  static mvp = new spine.webgl.Matrix4();
  static shader;
  static batcher;
  static skeletonRenderer;
  static debugRenderer;
  static debugShader;
  static shapes;
  static assetManager;
  static SkeletonBinaryData;
  static loading;

  static init(loadingSkeleton) {
    animation.canvas = document.getElementById("player");
    animation.canvas.width = window.innerWidth;
    animation.canvas.height = window.innerHeight;
    const config = { alpha: false };
    animation.ctx =
      animation.canvas.getContext("webgl", config) ||
      animation.canvas.getContext("experimental-webgl", config);
    // eslint-disable-next-line no-undef
    animation.shader = spine.webgl.Shader.newTwoColoredTextured(animation.ctx);
    // eslint-disable-next-line no-undef
    animation.batcher = new spine.webgl.PolygonBatcher(animation.ctx);
    animation.mvp.ortho2d(
      0,
      0,
      animation.canvas.width - 1,
      animation.canvas.height - 1
    );
    // eslint-disable-next-line no-undef
    animation.skeletonRenderer = new spine.webgl.SkeletonRenderer(
      animation.ctx
    );

    // eslint-disable-next-line no-undef
    animation.debugRenderer = new spine.webgl.SkeletonDebugRenderer(
      animation.ctx
    );
    const debugRenderer = animation.debugRenderer;
    debugRenderer.drawRegionAttachments = true;
    debugRenderer.drawBoundingBoxes = true;
    debugRenderer.drawMeshHull = true;
    debugRenderer.drawMeshTriangles = true;
    debugRenderer.drawPaths = true;

    // eslint-disable-next-line no-undef
    animation.debugShader = spine.webgl.Shader.newColored(animation.ctx);
    // eslint-disable-next-line no-undef
    animation.shapes = new spine.webgl.ShapeRenderer(animation.ctx);
    requestAnimationFrame(load);
    function load() {
      animation.loadDefaultAdditionAnimation();
      animation.loadCharaBaseData(loadingSkeleton);
      animation.lastFrameTime = Date.now() / 1000;
      animation.printAnimationStatus();
    }
  }

  static sliceCyspAnimation(buffer) {
    const view = new DataView(buffer);
    const count = view.getInt32(12, true);
    return {
      count: count,
      data: buffer.slice((count + 1) * 32),
    };
  }

  static setSpeedFactor(value) {
    animation.speedFactor = parseFloat(value);
  }

  static setGeneralBattleSkeletonData(data) {
    animation.generalBattleSkeletonData[data.id] = data.data;
  }

  static setGeneralAdditionAnimationData(data) {
    animation.generalAdditionAnimations[data.id] = {
      ...animation.generalAdditionAnimations[data.id],
      [data.type]: data.data,
    };
  }

  static setCurrentClasAnimData(data) {
    animation.currentClassAnimData = {
      type: data.type,
      data: data.data,
    };
  }

  static setCurrentCharaAnimData(data) {
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
    if (!animation.generalBattleSkeletonData[baseId]) {
      animation.setGeneralBattleSkeletonData(data);
    }
  }

  static async loadDefaultAdditionAnimation() {
    const baseId = "000000";
    animation.generalAdditionAnimations[baseId] =
      animation.generalAdditionAnimations[baseId] || {};
    additionAnimations.map(async (item) => {
      const response = await getBinaryFile(
        `assets/common/${baseId}_${item.type}.cysp`
      );
      const data = {
        id: baseId,
        data: animation.sliceCyspAnimation(response.data),
        type: item.type,
      };
      if (
        animation.generalAdditionAnimations[baseId][item.type] === undefined
      ) {
        animation.setGeneralAdditionAnimationData(data);
      }
    });
  }

  static async loadCharaBaseData(loadingSkeleton) {
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
          if (animation.generalBattleSkeletonData[baseId] === undefined) {
            animation.setGeneralBattleSkeletonData(data);
          }
          animation.loadAdditionAnimation(loadingSkeleton);
        }
      } catch {
        animation.loadAdditionAnimation(loadingSkeleton);
      }
    } else {
      animation.loadAdditionAnimation(loadingSkeleton);
    }
  }

  static loadAdditionAnimation(loadingSkeleton) {
    let doneCount = 0;
    const baseId = loadingSkeleton.baseId;
    animation.generalAdditionAnimations[baseId] =
      animation.generalAdditionAnimations[baseId] || {};
    additionAnimations.map(async (additionAnimation) => {
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
      if (
        animation.generalAdditionAnimations[baseId][data.type] === undefined
      ) {
        animation.setGeneralAdditionAnimationData(data);
      }

      animation.loadClassAnimation();
      // animation.loadClassAnimation();

      if (++doneCount === additionAnimations.length)
        animation.loadClassAnimation();
    });
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
          if (
            animation.currentClassAnimData.type !== currentClass &&
            animation.currentClassAnimData.data !== data.data
          ) {
            animation.setCurrentClasAnimData(data);
          }
          animation.loadCharaSkillAnimation();
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
        if (
          animation.currentCharaAnimData.id !== data.id &&
          animation.currentCharaAnimData.data !== data.data
        ) {
          animation.setCurrentCharaAnimData(data);
        }
        animation.loadTexture();
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
    const atlasText = await new Response(response.data).text();
    const img = new Image();
    img.onload = () => {
      const created = !!animation.skeleton.skeleton;
      if (created) {
        animation.skeleton.state.clearTracks();
        animation.skeleton.state.clearListeners();
        animation.ctx.deleteTexture(animation.currentTexture.texture);
      }
      // eslint-disable-next-line no-undef
      const imgTexture = new spine.webgl.GLTexture(animation.ctx, img);
      URL.revokeObjectURL(img.src);

      // eslint-disable-next-line no-undef
      const atlas = new spine.TextureAtlas(atlasText, function (path) {
        return imgTexture;
      });

      animation.currentTexture = imgTexture;

      // eslint-disable-next-line no-undef
      const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
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

      // const skeletonBinary = new SkeletonBinary(atlasLoader);
      // eslint-disable-next-line no-undef
      const skeletonBinary = new spine.SkeletonBinary(atlasLoader);
      skeletonBinary.scale = 1;
      const skeletonData = skeletonBinary.readSkeletonData(newBuff.buffer);

      animation.currentSkelData = newBuff.buffer;
      // setUpDownloadBlob(newBuff.buffer, "some0file.skel");
      // eslint-disable-next-line no-undef
      const skeleton = new spine.Skeleton(skeletonData);
      skeleton.setSkinByName("default");
      const bounds = animation.calculateBounds(skeleton);

      // eslint-disable-next-line no-undef
      const animationStateData = new spine.AnimationStateData(skeleton.data);

      // eslint-disable-next-line no-undef
      const animationState = new spine.AnimationState(animationStateData);
      animationState.addListener({
        complete: function tick() {
          if (animation.animationQueue.length) {
            let nextAnim = animation.animationQueue.shift();
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
      animation.loading = false;
      animation.skeleton = {
        skeleton: skeleton,
        state: animationState,
        bounds: bounds,
        premultipliedAlpha: true,
      };
      if (!created) {
        animation.canvas.style.width = "99%";
        requestAnimationFrame(animation.render);
        setTimeout(function () {
          animation.canvas.style.width = "";
        }, 0);
      }
    };
    img.src = URL.createObjectURL(pngResponse.data);
  }

  static calculateBounds(skeleton) {
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform();
    // eslint-disable-next-line no-undef
    const offset = new spine.Vector2();
    // eslint-disable-next-line no-undef
    const size = new spine.Vector2();
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

    const gl = animation.ctx;
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
    // eslint-disable-next-line no-undef
    animation.shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);
    // eslint-disable-next-line no-undef
    animation.shader.setUniform4x4f(
      // eslint-disable-next-line no-undef
      spine.webgl.Shader.MVP_MATRIX,
      animation.mvp.values
    );

    // Start the batch and tell the SkeletonRenderer to render the active skeleton.
    animation.batcher.begin(animation.shader);

    const skeletonRenderer = animation.skeletonRenderer;
    skeletonRenderer.premultipliedAlpha = premultipliedAlpha;
    skeletonRenderer.draw(animation.batcher, skeleton);
    animation.batcher.end();

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
    animation.ctx.viewport(0, 0, canvas.width, canvas.height);
  }

  static printAnimationStatus() {
    console.log(
      "generalAdditionAnimations",
      animation.generalAdditionAnimations
    );
    console.log(
      "generalBattleSkeletonData",
      animation.generalBattleSkeletonData
    );
  }
}
