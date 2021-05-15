import { State, PlayerListType, MoveDirection, CellType } from "../../types";

/**
 * Returns true if current or next cell has wall
 */
export const checkCellHasWall = (
  state: State,
  newPlayerCoord: string,
  direction: MoveDirection
) => {
  const { playerList, numberOfPlayer, gameField } = state;
  const currCellCoord = playerList[numberOfPlayer].coord;
  const currCell = gameField.values[currCellCoord];
  const nextCell = gameField.values[newPlayerCoord];
  const oppositeDirection = getOppositeDirection(direction);
  const currCellHasBarrier = checkCellOnBarrier(currCell, direction);

  const nextCellHasBarrier = checkCellOnBarrier(nextCell, oppositeDirection);

  if (currCellHasBarrier || nextCellHasBarrier) {
    return true;
  } else {
    return false;
  }
};

const checkCellOnBarrier = (cell: CellType, direction: MoveDirection) => {
  if (cell.name === "commonCell") {
    if (direction === "left" || direction === "bottom") {
      const cellHasBarrier =
        cell.barrierItem?.[direction]?.name === "wall" ? true : false;
      return cellHasBarrier;
    }
  }
  return false;
};

const getOppositeDirection = (direction: MoveDirection): MoveDirection => {
  switch (direction) {
    case "top": {
      return "bottom";
    }
    case "bottom": {
      return "top";
    }
    case "left": {
      return "right";
    }
    case "right": {
      return "left";
    }
  }
};
