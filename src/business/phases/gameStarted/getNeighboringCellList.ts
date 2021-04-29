import { State, AvailableCellListType } from "../../types";
import { MOVE_DIRECTION_LIST } from "../../../shared/config";
import { getNextPlayerCoord } from "./getNextPlayerCoord";

/**
 * Returns the coordinates of neighboribgCells that lying in the GameField.
 */
export const getNeighboringCellList = (state: State): AvailableCellListType => {
  const { playerList, numberOfPlayer, gameField } = state;

  const prevPlayerCoord = playerList[numberOfPlayer].coord;
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
  const existanceInGameFieldCells: AvailableCellListType = coordNeighboringCells.filter(
    (cellItem) => {
      const { direction, coord } = cellItem;
      return gameField.values[coord];
    }
  );
  return existanceInGameFieldCells;
};
