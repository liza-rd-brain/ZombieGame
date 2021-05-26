import { State, PlayerListType, MoveDirection, CellType } from "../../../types";

import { checkCellHasWall } from "../common/checkCellHasWall";
/** Cheking the cases when can't take the cell. In default we think that can. */
export const checkCanTakeCell = (
  state: State,
  nextPlayerCoord: string,
  direction: MoveDirection
) => {
  const { playerList, dice } = state;
  const metBarrier = checkCellHasWall(state, nextPlayerCoord, direction);
  const isLastStepOfMove = dice === 1;
  const isNextCellOcupied = checkNextCellOccupied(playerList, nextPlayerCoord);
  const canNotTakeCell = isLastStepOfMove && isNextCellOcupied;

  switch (true) {
    case metBarrier: {
      return false;
    }

    case canNotTakeCell: {
      // TODO: можно сделать промежуточное состояние для статуса с предупреждением о занятой чейке
      return false;
    }
    default: {
      return true;
    }
  }
};

const checkNextCellOccupied = (
  playersList: PlayerListType,
  newCoord: string
): boolean => {
  const iterablePlayerList = Object.entries(playersList);
  const isCellOccupied = iterablePlayerList.some((player) => {
    const [, playerValue] = player;
    return playerValue.coord === newCoord;
  });
  return isCellOccupied;
};
