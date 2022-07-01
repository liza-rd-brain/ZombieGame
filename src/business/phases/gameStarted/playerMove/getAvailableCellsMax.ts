import { AvailableCellListType, State } from "../../../types";
import { getNeighboringCellList } from "../../common";
import { getNeighboringCellListMax } from "../../common/getNeighboringCellListMax";
import { checkCanTakeCell } from "./checkCanTakeCell";

/**
 * Current player get field "availableForTake" with coordinate of cells that can be taken
 */
export const getAvailableCellsMax = (state: State): State => {
  const { playerList, activePlayerNumber, gameField, dice } = state;
  const prevPlayerCoord = playerList[activePlayerNumber].coord;

  const neighboringCellList = getNeighboringCellListMax(
    prevPlayerCoord,
    gameField,
    dice
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
    doEffect: null,
    gameState: { ...state.gameState, coordOfAvailableCells },
  };
};
