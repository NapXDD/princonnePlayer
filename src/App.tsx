import { useEffect } from "react";
import "./App.css";
import Tool from "./component/tool/tool";
import spine, {
  ManagedWebGLRenderingContext,
} from "@esotericsoftware/spine-webgl";

function App() {
  useEffect(() => {
    // Create the managed WebGL context. Managed contexts will restore resources like shaders
    // and buffers automatically if the WebGL context is lost.
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const config = {
      alpha: false,
    };
    const ctx = new spine.ManagedWebGLRenderingContext(canvas, config);
    if (!ctx.gl) {
      alert("WebGL is unavailable.");
      return;
    }

    // Create a simple shader, mesh, model-view-projection matrix, SkeletonRenderer, and AssetManager.
    let shader = spine.Shader.newTwoColoredTextured(ctx);
    let batcher = new spine.PolygonBatcher(ctx);
    const mvp = new spine.Matrix4();
    mvp.ortho2d(0, 0, canvas.width - 1, canvas.height - 1);
    let skeletonRenderer = new spine.SkeletonRenderer(ctx);
    let assetManager = new spine.AssetManager(ctx, "/Data/assets");

    // Create a debug renderer and the ShapeRenderer it needs to render lines.
    let debugRenderer = new spine.SkeletonDebugRenderer(ctx);
    debugRenderer.drawRegionAttachments = true;
    debugRenderer.drawBoundingBoxes = true;
    debugRenderer.drawMeshHull = true;
    debugRenderer.drawMeshTriangles = true;
    debugRenderer.drawPaths = true;
    let debugShader = spine.Shader.newColored(ctx);
    let shapes = new spine.ShapeRenderer(ctx);
  }, []);

  return (
    <>
      <Tool />
      <canvas id="canvas" width="0" height="0"></canvas>
    </>
  );
}

export default App;
