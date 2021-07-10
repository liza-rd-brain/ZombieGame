import { AvailableCellListType, GameField } from "../../types";
import { getNextPlayerCoord } from "./getNextPlayerCoord";
import { config } from "../../../business/initialState";

/**
 * Returns the coordinates of neighboribgCells that lying in the GameField.
 */
export const getNeighboringCellList = (
  prevPlayerCoord: string,
  gameField: GameField
): AvailableCellListType => {
  const coordNeighboringCells: AvailableCellListType =
    config.MOVE_DIRECTION_LIST.map((directionItem) => {
      return {
        direction: directionItem,
        coord: getNextPlayerCoord(prevPlayerCoord, directionItem),
      };
    });

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
