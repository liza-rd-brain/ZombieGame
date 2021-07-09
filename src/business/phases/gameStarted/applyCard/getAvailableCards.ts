import { canInteractWithCell } from "../../../../components/PlayerList/canInteractWithCell";
import { AvailableCellListType, State } from "../../../types";
import { getNeighboringCellList } from "../../common";

export const getAvailableCards = (state: State) => {
  const { playerList, activePlayerNumber, gameField } = state;

  const activePlayerCoord = playerList[activePlayerNumber].coord;

  const neighboringCellList = getNeighboringCellList(
    activePlayerCoord,
    gameField
  );

  const availableCellList: AvailableCellListType = neighboringCellList.filter(
    (cellItem) => {
      const { direction, coord } = cellItem;

      return canInteractWithCell(state, coord, direction);
    }
  );

  const availableCellsCoords = availableCellList
    .map((cellItem) => {
      const { direction, coord } = cellItem;
      return coord;
    })
    .concat(activePlayerCoord);

  return availableCellsCoords;
};
