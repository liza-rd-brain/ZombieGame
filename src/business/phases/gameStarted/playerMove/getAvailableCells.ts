import { AvailableCellListType, State } from "../../../types";
import { getNeighboringCellList } from "../../common";
import { checkCanTakeCell } from "./checkCanTakeCell";

/**
 * Current player get field "availableForTake" with coordinate of cells that can be taken
 */
export const getAvailableCells = (state: State): State => {
  const { playerList, activePlayerNumber, gameField } = state;
  const prevPlayerCoord = playerList[activePlayerNumber].coord;
  const neighboringCellList = getNeighboringCellList(
    prevPlayerCoord,
    gameField
  );

  /**
   * Returns the coordinates of Cell that can be taken by player.
   */
  const availableCellList: AvailableCellListType = neighboringCellList.filter(
    (cellItem) => {
      const { direction, coord } = cellItem;

      return checkCanTakeCell(state, coord, direction);
    }
  );

  const coordOfAvailableCells = availableCellList.map((cellItem) => {
    const { coord } = cellItem;
    return coord;
  });

  return {
    ...state,
    gameState: { ...state.gameState, coordOfAvailableCells },
  };
};
