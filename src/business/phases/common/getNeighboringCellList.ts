import {
  AvailableCellListType,
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
export const getNeighboringCellList = (
  prevPlayerCoord: string,
  gameField: GameField
): AvailableCellListType => {
  const coordNeighboringCells: AvailableCellListType = MOVE_DIRECTION_LIST.map(
    (directionItem) => {
      return {
        direction: directionItem,
        coord: getNextPlayerCoord(prevPlayerCoord, directionItem),
      };
    }
  );

  /**
   * Returns the coordinates that lying in the GameField.
   */
  const existanceInGameFieldCells: AvailableCellListType =
    coordNeighboringCells.filter((cellItem) => {
      const { coord } = cellItem;
      return gameField.values[coord];
    });

  return existanceInGameFieldCells;
};
