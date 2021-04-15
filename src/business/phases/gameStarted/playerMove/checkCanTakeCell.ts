import { State, PlayerListType, MoveDirection, CellType } from "../../../types";

/** Cheking the cases when can't take the cell. In default we think that can. */
export const checkCanTakeCell = (
  state: State,
  nextPlayerCoord: string,
  direction: MoveDirection
) => {
  const { gameField, playerList, dice } = { ...state };
  const nextCellWForPlayer = gameField.values[nextPlayerCoord];
  const nextCellOutOfGameField = nextCellWForPlayer ? false : true;

  switch (nextCellOutOfGameField) {
    case true: {
      console.log("не можем выйти за границу поля");
      return false;
    }

    case false: {
      const metBarrier = cellHasWall(state, nextPlayerCoord, direction);
      const isLastStepOfMove = dice === 1;
      const isNextCellOcupied = checkNextCellOccupied(
        playerList,
        nextPlayerCoord
      );
      const canNotTakeCell = isLastStepOfMove && isNextCellOcupied;

      switch (true) {
        case metBarrier: {
          console.log("встретили стену");
          return false;
        }

        case canNotTakeCell: {
          // TODO: можно сделать промежуточное состояние для статуса с предупреждением о занятой чейке
          console.log("ячейка занята");
          return false;
        }
        default: {
          return true;
        }
      }
    }
    default: {
      return true;
    }
  }
};

/**
 * Returns true if current or next cell has wall
 */
const cellHasWall = (
  state: State,
  newPlayerCoord: string,
  direction: MoveDirection
) => {
  const { playerList, numberOfPlayer, gameField } = state;
  const currCellCoord = playerList[numberOfPlayer].coord;
  const currCell = gameField.values[currCellCoord];
  const nextCell = gameField.values[newPlayerCoord];
  const oppositeDirection = getOppositeDirection(direction);
  const currCellHasBarrier = checkCellOnSurface(currCell, direction);

  const nextCellHasBarrier = checkCellOnSurface(nextCell, oppositeDirection);

  if (currCellHasBarrier || nextCellHasBarrier) {
    return true;
  } else {
    return false;
  }
};

const checkCellOnSurface = (cell: CellType, direction: MoveDirection) => {
  if (cell.name === "commonCell") {
    const cellHasBarrier =
      cell.surfaceItem?.[direction] === "wall" ? true : false;
    return cellHasBarrier;
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
