import { State, MoveDirection, EnemyListType } from "../../types";

import { checkCellHasWall } from "../common/checkCellHasWall";
/*
 * Cheking the cases when can't take the cell. In default we think that can.
 */
export const checkCanTakeCell = (
  state: State,
  nextPlayerCoord: string,
  direction: MoveDirection
) => {
  const { dice, enemyList } = state;
  const metBarrier = checkCellHasWall(state, nextPlayerCoord, direction);
  const isLastStepOfMove = dice === 1;
  const isNextCellOcupied = checkNextCellOccupied(enemyList, nextPlayerCoord);
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
  enemyList: EnemyListType,
  newCoord: string
): boolean => {
  const iterableEnemyList = Object.entries(enemyList);
  const isCellOccupied = iterableEnemyList.some(([, enemyCard]) => {
    return enemyCard.coord === newCoord && enemyCard.apperance !== "closed";
  });
  return isCellOccupied;
};
