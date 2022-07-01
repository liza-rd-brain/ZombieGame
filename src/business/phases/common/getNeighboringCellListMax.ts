import {
  AvailableCellListType,
  AvailableCellType,
  GameField,
  MoveDirectionList,
} from "../../types";
import { getNextPlayerCoord } from "./getNextPlayerCoord";

export const MOVE_DIRECTION_LIST: MoveDirectionList = [
  "top",
  "right",
  "bottom",
  "left",
];

/**
 * Returns the coordinates of neighboribgCells that lying in the GameField.
 */
export const getNeighboringCellListMax = (
  prevPlayerCoord: string,
  gameField: GameField,
  dice: number
): AvailableCellListType => {
  const coordNeighboringCells: AvailableCellListType = MOVE_DIRECTION_LIST.map(
    (directionItem) => {
      return {
        direction: directionItem,
        coord: getNextPlayerCoord(prevPlayerCoord, directionItem),
      };
    }
  );

  const getCoordNeibCells = (coord: string) => {
    const coordList = MOVE_DIRECTION_LIST.map((directionItem) => {
      const newCoord = getNextPlayerCoord(coord, directionItem);
      return newCoord;
    });

    // console.log("coordList", coordList);

    return coordList;
  };

  type InitCoordObjType = {
    list: Array<string>;
    counter: number;
  };

  const initCoordObj: InitCoordObjType = {
    list: [],
    counter: dice,
  };

  const getTakeableCoord = (
    MOVE_DIRECTION_LIST: MoveDirectionList,
    dice: number,
    initPlayerCoord: string
  ) => {
    let takeableCoordList: InitCoordObjType = {
      list: [initPlayerCoord],
      counter: dice,
    };

    for (let i = 0; i < dice; i++) {
      const currList = takeableCoordList.list.reduce(
        (prev: Array<string>, coord) => {
          const currCoordList = getCoordNeibCells(coord);

          const listWithoutInitCoord = currCoordList.filter(
            (coord) => coord !== initPlayerCoord
          );

          const existingInFieldCoord = listWithoutInitCoord.filter(
            (coord) => gameField.values[coord]
          );
          console.log("currCoord", coord);
          console.log("existingInFieldCoord", existingInFieldCoord);
          console.log("i", i);

          if (prev.length > 1) {
            const coordWithoutRepeat = existingInFieldCoord.filter(
              (existCoord) => {
                return !prev.includes(existCoord);
              }
            );

            return [...prev, ...coordWithoutRepeat];
          } else {
            return existingInFieldCoord;
          }
        },
        takeableCoordList.list
      );

      takeableCoordList = {
        list: [...currList],
        counter: dice - 1,
      };
    }

    console.log("takeableCoordList", takeableCoordList);
    return takeableCoordList;
  };

  const testAbleCoord = getTakeableCoord(
    MOVE_DIRECTION_LIST,
    dice,
    prevPlayerCoord
  );

  console.log("testAbleCoord", testAbleCoord);

  // console.log("coordNeighboringCells", coordNeighboringCells);

  const testCells = [
    ...coordNeighboringCells,
    { direction: "top", coord: "0.1" },
  ];

  // console.log("testCells", testCells);

  /**
   * Returns the coordinates that lying in the GameField.
   */
  const existingInGameFieldCells: AvailableCellListType =
    coordNeighboringCells.filter((cellItem) => {
      const { coord } = cellItem;
      return gameField.values[coord];
    });

  return existingInGameFieldCells;
};

// const testArr = [
//   { direction: "top", coord: "0.1" },
//   { direction: "right", coord: "1.0" },
//   { direction: "bottom", coord: "0.-1" },
//   { direction: "left", coord: "-1.0" },
// ];
