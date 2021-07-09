import { State, MoveDirection, CellType } from "../../types";

/**
 * Returns true if current or next cell has wall
 */
export const checkCellHasWall = (
  state: State,
  newPlayerCoord: string,
  direction: MoveDirection
) => {
  const { playerList, activePlayerNumber, gameField } = state;
  const currCellCoord = playerList[activePlayerNumber].coord;
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
    //Now in config just left and bottom walls
    if (direction === "left" || direction === "bottom") {
      const cellHasWall = cell.barrierList?.find(
        (barrier) => barrier.name === "wall" && barrier.direction === direction
      )
        ? true
        : false;
      const cellHasClosedHole = cell.barrierList?.find(
        (barrier) => barrier.isOpen === false && barrier.direction === direction
      )
        ? true
        : false;
      const cellHasBarrier = cellHasWall || cellHasClosedHole;
      return cellHasBarrier;
    }
    return false;
  }
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
