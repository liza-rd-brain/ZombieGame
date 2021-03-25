import {
  MoveDirection,
  CellType,
  State,
  GameField,
  NewPlayersList,
} from "../../types";
import { ActionType } from "../../reducer";

const сhangePlayerCoord = (currentIndex: string, direction: MoveDirection) => {
  const [currPlayerHor, currPlayerVert] = currentIndex.split(".");
  const nextPlayerVert = parseInt(currPlayerVert) + 1;
  const nextPlayerHor = parseInt(currPlayerHor) + 1;
  const prevPlayerVert = parseInt(currPlayerVert) - 1;
  const prevPlayerHor = parseInt(currPlayerHor) - 1;

  switch (direction) {
    case "top": {
      return `${currPlayerHor}.${nextPlayerVert}`;
    }

    case "bottom": {
      return `${currPlayerHor}.${prevPlayerVert}`;
    }

    case "left": {
      return `${prevPlayerHor}.${currPlayerVert}`;
    }

    case "right": {
      return `${nextPlayerHor}.${currPlayerVert}`;
    }

    default:
      return `${currPlayerHor}.${currPlayerVert}`;
  }
};

// TODO: функция слишком громоздкая, разделить на нексколько более явных
const getNewState = (
  newCellWithPlayer: CellType,
  state: State,

  isNextTrowLast: boolean,
  newPlayerCoord: string,
  newPlayerList: NewPlayersList
) => {
  switch (newCellWithPlayer.name) {
    case "finish": {
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameResult: "Вы выиграли",
        playersList: newPlayerList,
      };
      return newState;
    }

    case "commonCell": {
      const hasHealthCell = newCellWithPlayer.cardItem.healthItem !== undefined;

      switch (hasHealthCell) {
        case true: {
          const newState: State = {
            ...state,
            dice: state.dice - 1,
            gameState: {
              type: "gameStarted.takeHealthCard",
            },
            doEffect: { type: "!needOpenHealthCard" },
            playersList: newPlayerList,
          };
          return newState;
        }

        case false: {
          switch (isNextTrowLast) {
            case true: {
              const newState: State = {
                ...state,
                dice: state.dice - 1,
                gameState: {
                  type: "gameStarted.getOrder",
                },
                doEffect: {
                  type: "!getNextPlayer",
                },
                playersList: newPlayerList,
              };
              return newState;
            }

            case false: {
              const newState: State = {
                ...state,
                dice: state.dice - 1,
                gameState: {
                  type: "gameStarted.clickArrow",
                },
                playersList: newPlayerList,
              };
              return newState;
            }

            default: {
              return state;
            }
          }
        }
        default: {
          return state;
        }
      }
    }

    default: {
      return state;
    }
  }
};

const checkNextCell = (
  playersList: NewPlayersList,
  newCoord: string,
  playersNumber: number
): boolean => {
  const iterablePlayerList = Object.entries(playersList);
  const isCellOccupied = iterablePlayerList.some((player) => {
    const [, playerValue] = player;
    return playerValue.coord === newCoord;
  });
  return !isCellOccupied;
};

export const clickArrow = (action: ActionType, state: State): State => {
  switch (action.type) {
    case "arrowPressed": {
      const direction = action.payload;
      const gameField = state.gameField;
      const playersList = state.playersList;
      const isNextTrowLast = state.dice === 1;
      console.log(state);
      const playersNumber = state.numberOfPlayer;

      const prevPlayerCoord = playersList[playersNumber].coord;
      const newPlayerCoord = сhangePlayerCoord(prevPlayerCoord, direction);

      console.log(gameField);

      const newCellWithPlayer = gameField.values[newPlayerCoord];

      const isNextCellFree = checkNextCell(
        playersList,
        newPlayerCoord,
        playersNumber
      );

      const newPlayerList = {
        ...playersList,
        [playersNumber]: {
          ...playersList[playersNumber],
          coord: newPlayerCoord,
        },
      };

      console.log("newPlayerList", newPlayerList);

      const newState = getNewState(
        newCellWithPlayer,
        state,
        isNextTrowLast,
        newPlayerCoord,
        newPlayerList
      );

      console.log("stateAfterClick", newState);

      /*  if (isNextCellFree) { */
      return newState;
      /* } else {
        return state;
      } */
    }

    default: {
      return state;
    }
  }
};
