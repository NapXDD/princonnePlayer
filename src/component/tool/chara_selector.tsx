import { Box, Button, Select } from "@chakra-ui/react";
import { ChangeEvent, Fragment, useEffect } from "react";
import { getClassMap } from "../../utils/axios/axiosGet";
import { dataList } from "../../types/selector";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { updateUnit } from "../../redux/features/unit/unit";
import { setClassMap } from "../../redux/features/classMap/classMap";
import { updateLoadingSkeleton } from "../../redux/features/spine/loadingSkeleton";

const charaList: dataList[] = [
  {
    value: "1",
    label: "KNUCKLE",
  },
  {
    value: "2",
    label: "SHORTSWORD",
  },
  { value: "3", label: "AX" },
  { value: "4", label: "SWORD" },
  { value: "5", label: "LONGSWORD" },
  { value: "6", label: "SPEAR" },
  { value: "7", label: "WAND" },
  { value: "8", label: "ARROW" },
  { value: "9", label: "DAGGER" },
  { value: "10", label: "LONGSWORD_2" },
  { value: "21", label: "WAND_KIMONO" },
  { value: "22", label: "SWORD_KIMONO" },
  { value: "23", label: "NO_WAND_WITCH" },
  { value: "24", label: "Re:Zero" },
];

export default function CharaSelector() {
  const charactersData = useSelector((state: RootState) => state.classMap);
  const unitState = useSelector((state: RootState) => state.unitState);
  const loadingSkeleton = useSelector(
    (state: RootState) => state.loadingSkeleton
  );
  const dispatch = useDispatch();

  const baseId = Object.keys(charactersData) && Object.keys(charactersData);

  const handleSelector = (event: ChangeEvent<HTMLSelectElement>) => {
    const baseId = `${event.target.value.slice(0, 4)}01`;
    const currentUnit = {
      id: event.target.value,
      classType: charactersData[parseInt(event.target.value)],
    };
    const unitData = {
      ...unitState,
      id: currentUnit.id,
      classType: currentUnit.classType,
    };
    const skeletonData = {
      ...loadingSkeleton,
      id: currentUnit.id,
      info: charactersData[parseInt(baseId)],
      baseId: "000000",
    };
    dispatch(updateLoadingSkeleton(skeletonData));
    dispatch(updateUnit(unitData));
  };

  const handleGetClassMap = async () => {
    try {
      const { data } = await getClassMap("classMap/classMap.json");
      dispatch(setClassMap(data));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    handleGetClassMap();
  }, []);

  return (
    <>
      <Box
        id="character-selector"
        className="flex justify-center"
        paddingTop={1}
        paddingBottom={2}
      >
        <Box className="flex justify-center items-center">
          {
            <Fragment>
              <Box paddingRight={1}>Character:</Box>
              <Select
                paddingRight={1}
                borderColor={"black"}
                bg={"white"}
                id="skeletonList"
                value={unitState.id}
                onChange={(e) => handleSelector(e)}
              >
                {baseId &&
                  baseId.map((item, index) => {
                    const baseId = parseInt(item);
                    const notAdded =
                      charactersData[baseId].type === "0" &&
                      !charactersData[baseId].hasSpecialBase;
                    // a character will have 1,3 star modal, if properties hasRarity6 is true, then the character will have a 6 star modal
                    // if the character have special base animation and character type = 0,
                    // it will not add to the list because we dont have enough animation file for that unit
                    if (notAdded) {
                      return (
                        <option key={`${baseId} + ${index}`} value={baseId}>
                          {`${charactersData[baseId].name} (not installed)`}
                        </option>
                      );
                    } else {
                      return (
                        <Fragment key={`${baseId} + ${index}`}>
                          <option
                            key={`${baseId + 10} + ${index}`}
                            value={baseId + 10}
                          >
                            {`1★${charactersData[baseId].name}`}
                          </option>
                          <option
                            key={`${baseId + 30} + ${index}`}
                            value={baseId + 30}
                          >
                            {`3★${charactersData[baseId].name}`}
                          </option>
                          {charactersData[baseId].hasRarity6 && (
                            <option
                              key={`${baseId + 60} + ${index}`}
                              value={baseId + 60}
                            >
                              {`6★${charactersData[baseId].name}`}
                            </option>
                          )}
                        </Fragment>
                      );
                    }
                  })}
              </Select>
              <Select
                id="classList"
                borderColor={"black"}
                bg={"white"}
                paddingRight={1}
                value={loadingSkeleton.info.type}
                disabled
              >
                {charaList.map((item, index) => (
                  <option key={`${item} + ${index}`} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
              <Button whiteSpace={"initial"} colorScheme="blue">
                <span>skel download</span>
              </Button>
            </Fragment>
          }
        </Box>
      </Box>
    </>
  );
}
