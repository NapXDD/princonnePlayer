import { useEffect } from "react";
import "./App.css";
import Tool from "./component/tool/tool";

function App() {
  useEffect(() => {
    const canvas = document.getElementById("canvas");
    console.log(canvas);
  }, []);

  return (
    <>
      <Tool />
      <canvas id="canvas" width="0" height="0"></canvas>
    </>
  );
}

export default App;
