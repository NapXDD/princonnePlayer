import { useEffect } from "react";

export default function CanvasScreen() {
  useEffect(() => {}, []);

  return <canvas id="player" width={0} height={0}></canvas>;
}
