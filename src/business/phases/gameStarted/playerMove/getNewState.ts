import { State, PlayerListType, MoveDirection, CellType } from "../../../types";

import { switchToNextPlayer } from "../../../../shared/State";
/**
 * @returns A new state depending on the result of the player's movement.
 */
export const getNewState = (
  state: State,
  newPlayerCoord: string,
  direction: MoveDirection
) => {
  const { gameField, playerList, numberOfPlayer, dice } = { ...state };

  const newCellWithPlayer = gameField.values[newPlayerCoord];

  const newPlayerList = {
    ...playerList,
    [numberOfPlayer]: {
      ...playerList[numberOfPlayer],
      coord: newPlayerCoord,
    },
  };

  const playerLeftTheField = newCellWithPlayer ? false : true;
  const takeFinish = newCellWithPlayer?.name === "finish";

  const takeHealthCard =
    newCellWithPlayer?.name === "commonCell" &&
    newCellWithPlayer?.cardItem.healthItem !== undefined;

  const metEnemyCard =
    newCellWithPlayer?.name === "commonCell" && state.enemyList[newPlayerCoord]
      ? true
      : false;

  const isLastStepOfMove = dice === 1;

  const isNextCellOcupied = checkNextCellOccupied(
    playerList,
    newPlayerCoord,
    numberOfPlayer
  );

  const canNotTakeCell = isLastStepOfMove && isNextCellOcupied;

  const metSurface = cellHasWall(state, newPlayerCoord, direction);

  // TODO: Is flat switch okey? Or i need in nested?!
  switch (true) {
    case playerLeftTheField: {
      return state;
    }

    case metSurface: {
      console.log("не можем пройти сквозь стену");
      return state;
    }

    // TODO: переиспользуемая часть state
    case takeFinish: {
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameResult: "Вы выиграли",
        playerList: newPlayerList,
      };
      return newState;
    }

    case takeHealthCard: {
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameState: {
          type: "gameStarted.takeHealthCard",
        },
        doEffect: { type: "!openHealthCard" },
        playerList: newPlayerList,
      };
      return newState;
    }

    case metEnemyCard: {
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameState: {
          type: "gameStarted.interactEnemyCard",
        },
        doEffect: { type: "!checkApperanceEnemyCard" },
        playerList: newPlayerList,
      };
      return newState;
    }

    case canNotTakeCell: {
      // TODO: можно сделать промежуточное состояние для статуса с предупреждением о занятой чейке
      console.log("ячейка занята");
      return state;
    }

    case isLastStepOfMove: {
      const changedPartState = switchToNextPlayer();
      const newState: State = {
        ...state,
        ...changedPartState,
        playerList: newPlayerList,
      };
      return newState;
    }

    default: {
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameState: {
          type: "gameStarted.playerMove",
        },
        playerList: newPlayerList,
      };
      return newState;
    }
  }
};

const checkNextCellOccupied = (
  playersList: PlayerListType,
  newCoord: string,
  playersNumber: number
): boolean => {
  const iterablePlayerList = Object.entries(playersList);
  const isCellOccupied = iterablePlayerList.some((player) => {
    const [, playerValue] = player;
    return playerValue.coord === newCoord;
  });
  return isCellOccupied;
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
