import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect } from "react";
import {
  Shader,
  PolygonBatcher,
  Matrix4,
  SkeletonRenderer,
  SkeletonDebugRenderer,
  ShapeRenderer,
  ManagedWebGLRenderingContext,
} from "@esotericsoftware/spine-webgl";

export default function CanvasScreen() {
  useEffect(() => {
    // Create the managed WebGL context. Managed contexts will restore resources like shaders
    // and buffers automatically if the WebGL context is lost.
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const config = {
      alpha: false,
    };
    const ctx = new ManagedWebGLRenderingContext(canvas, config);
    if (!ctx.gl) {
      alert("WebGL is unavailable.");
      return;
    }
    // Create a simple shader, mesh, model-view-projection matrix, SkeletonRenderer, and AssetManager.
    const shader = Shader.newTwoColoredTextured(ctx);
    const batcher = new PolygonBatcher(ctx);
    const mvp = new Matrix4();
    mvp.ortho2d(0, 0, canvas.width - 1, canvas.height - 1);
    const skeletonRenderer = new SkeletonRenderer(ctx);
    // Create a debug renderer and the ShapeRenderer it needs to render lines.
    const debugRenderer = new SkeletonDebugRenderer(ctx);
    debugRenderer.drawRegionAttachments = true;
    debugRenderer.drawBoundingBoxes = true;
    debugRenderer.drawMeshHull = true;
    debugRenderer.drawMeshTriangles = true;
    debugRenderer.drawPaths = true;
    const debugShader = Shader.newColored(ctx);
    const shapes = new ShapeRenderer(ctx);
  }, []);

  return <canvas id="canvas" width={0} height={0}></canvas>;
}
