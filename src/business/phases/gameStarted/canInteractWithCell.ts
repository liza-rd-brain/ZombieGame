import { State, PlayerListType, MoveDirection, CellType } from "../../types";
import { checkCellHasWall } from "./checkCellHasWall";
/** Cheking the cases when can't take the cell. In default we think that can. */
export const canInteractWithCell = (
  state: State,
  nextPlayerCoord: string,
  direction: MoveDirection
) => {
  const { gameField, playerList, dice } = state;
  const nextCellForPlayer = gameField.values[nextPlayerCoord];
  const nextCellOutOfGameField = nextCellForPlayer ? false : true;

  switch (nextCellOutOfGameField) {
    case true: {
      console.log("не можем выйти за границу поля");
      return false;
    }

    case false: {
      const metBarrier = checkCellHasWall(state, nextPlayerCoord, direction);

      switch (true) {
        case metBarrier: {
          console.log("встретили стену");
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
