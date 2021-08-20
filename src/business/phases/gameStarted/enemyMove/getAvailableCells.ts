import { AvailableCellListType, State } from "../../../types";
import { getNeighboringCellList } from "../../common";
import { checkCanTakeCell } from "./checkCanTakeCell";

/**
 * Current player(deadPlayer) get field "availableForTake" with coordinate of cells that can be taken
 */

export const getAvailableCells = (state: State): State => {
  const { activePlayerNumber, gameField, deadPlayerList, enemyList } = state;

  const deadPLayerCoord = deadPlayerList
    ? enemyList[deadPlayerList[activePlayerNumber].index].coord
    : null;

  if (deadPLayerCoord) {
    const neighboringCellList = getNeighboringCellList(
      deadPLayerCoord,
      gameField
    );

    /**
     * Returns the coordinates of cell that can be taken by deadPlayer.
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
  } else {
    return state;
  }
};
