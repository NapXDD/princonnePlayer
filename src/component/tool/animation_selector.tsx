import { Box, Select } from "@chakra-ui/react";
import { dataList } from "../../types/selector";
import { Checkbox } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { CanvasState } from "../../types/canvas";
import { ChangeEvent } from "react";
import { updateCanvas } from "../../redux/features/canvas/canvas";
import { UnitState } from "../../types/character";
import { updateUnit } from "../../redux/features/unit/unit";

const animationList: dataList[] = [
  {
    value: "idle",
    label: "idle",
  },
  {
    value: "standBy",
    label: "stand by",
  },
  { value: "walk", label: "walk" },
  { value: "run_gamestart", label: "run gamestart" },
  { value: "landing", label: "landing" },
  { value: "attack", label: "attack" },
  { value: "attack_skipQuest", label: "attack (sweep)" },
  { value: "joy_short,hold,joy_short_return", label: "celebrate - short" },
  { value: "joy_long,hold,joy_long_return", label: "celebrate - long" },
  { value: "damage", label: "damage" },
  { value: "die,stop", label: "die" },
  { value: "multi_standBy", label: "cooperation - preparation" },
  { value: "multi_idle_standBy", label: "co-op - Idle" },
  { value: "multi_idle_noWeapon", label: "co-op - idle (No Weapons)" },
];

const speedList: dataList[] = [
  {
    value: "0.016",
    label: "0.016x",
  },
  {
    value: "0.1",
    label: "0.1x",
  },
  { value: "0.25", label: "0.25x" },
  { value: "0.5", label: "0.5x" },
  { value: "0.75", label: "0.75x" },
  { value: "1", label: "1x" },
  { value: "1.25", label: "1.25x" },
  { value: "1.5", label: "1.5x" },
  { value: "2", label: "2x" },
];

export default function AnimationSelector() {
  const canvasState = useSelector((state: RootState) => state.canvasState);
  const unitState = useSelector((state: RootState) => state.unitState);
  const dispatch = useDispatch();

  const handleChangeBG = (event: ChangeEvent<HTMLInputElement>) => {
    const canvasData: CanvasState = {
      ...canvasState,
      canvasBG: event.target.value,
    };
    dispatch(updateCanvas(canvasData));
  };

  const handleChangeShowNode = () => {
    const canvasData: CanvasState = {
      ...canvasState,
      showNode: !canvasState.showNode,
    };
    dispatch(updateCanvas(canvasData));
  };

  const handleChangeAnimation = (event: ChangeEvent<HTMLSelectElement>) => {
    const unitData: UnitState = {
      ...unitState,
      animation: event.target.value,
    };
    dispatch(updateUnit(unitData));
  };

  const handleChangeAnimationSpd = (event: ChangeEvent<HTMLSelectElement>) => {
    const unitData: UnitState = {
      ...unitState,
      animationSpeed: event.target.value,
    };
    dispatch(updateUnit(unitData));
  };
  return (
    <>
      <div id="animation-selector" className="flex justify-center items-center">
        <Box paddingRight={1}>Animation:</Box>
        <Select
          borderColor={"black"}
          bg={"white"}
          width={"auto"}
          paddingRight={1}
          value={unitState.animation}
          onChange={(e) => handleChangeAnimation(e)}
        >
          {animationList.map((item, index) => (
            <option key={index + item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
        <Box paddingRight={1}>Animation speed:</Box>
        <Select
          borderColor={"black"}
          bg={"white"}
          width={"auto"}
          value={unitState.animationSpeed}
          paddingRight={1}
          onChange={(e) => handleChangeAnimationSpd(e)}
        >
          {speedList.map((item, index) => (
            <option key={index + item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
        <Box paddingRight={1}>Show node:</Box>
        <Checkbox
          borderColor={"black"}
          border={"1px solid"}
          borderRadius={"4px"}
          isChecked={canvasState.showNode}
          onChange={handleChangeShowNode}
        />
        <Box paddingRight={1} paddingLeft={1}>
          BG:
        </Box>
        <Input
          onChange={(e) => handleChangeBG(e)}
          width={"auto"}
          borderColor={"black"}
          border={"1px solid"}
          value={canvasState.canvasBG}
        />
      </div>
    </>
  );
}
