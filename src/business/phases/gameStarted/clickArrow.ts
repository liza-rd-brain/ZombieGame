import { MoveDirection, CellType, State, GameField } from "../../types";
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

const movePlayerInGameField = (
  gameField: GameField,
  nextIndex: string,
  prevIndex: string,
  playersNumber: number
): GameField => {
  const gameFieldValues = gameField.values;
  const prevCell = gameFieldValues[prevIndex];
  const nextCell = gameFieldValues[nextIndex];

  // TODO: провалидировать заранее ячейку с карточкой человека, она точно не может  быть стеной
  if (nextCell.name !== "wall" && prevCell.name !== "wall") {
    const { playerList, ...otherCardItem } = { ...prevCell.cardItem };

    const movedPlayer =
      playerList?.filter((player) => {
        return player.orderNumber === playersNumber;
      }) || [];

    const remainingPlayers =
      playerList?.filter((player) => {
        return player.orderNumber !== playersNumber;
      }) || [];

    const prevCellWithoutPlayer = {
      ...prevCell,
      cardItem: { ...otherCardItem, playerList: remainingPlayers },
    };

    const nextCellWithPlayer: CellType = {
      ...nextCell,
      cardItem: {
        ...nextCell.cardItem,
        playerList: nextCell.cardItem.playerList
          ? nextCell.cardItem.playerList?.concat(movedPlayer)
          : movedPlayer,
      },
    };

    const newGameField = {
      ...gameField,
      values: {
        ...gameField.values,
        [nextIndex]: nextCellWithPlayer,
        [prevIndex]: prevCellWithoutPlayer,
      },
    };

    return newGameField;
  } else {
    return gameField;
  }
};

const getNewState = (
  newCellWithPlayer: CellType,
  state: State,
  newGameField: GameField,
  cardInteractIndex: string[],
  isNextTrowLast: boolean,
  newPlayerCoord: string
) => {
  switch (newCellWithPlayer.name) {
    case "finish": {
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameField: newGameField,
        gameState: { type: "endGame", context: {} },
        gameResult: "Вы выиграли",
        /*  cardInteractIndex: cardInteractIndex, */
      };
      return newState;
    }

    case "commonCell": {
      const hasPlayerAndHealthCell =
        newCellWithPlayer.cardItem.healthItem !== undefined &&
        newCellWithPlayer.cardItem.playerList !== undefined;

      switch (hasPlayerAndHealthCell) {
        case true: {
          const newState: State = {
            ...state,
            dice: state.dice - 1,
            gameField: newGameField,
            gameState: {
              type: "gameStarted.takeHealthCard",
              context: {
                index: newPlayerCoord,
                playerAndHealthCell: newCellWithPlayer,
              },
            },
            doEffect: { type: "!needOpenHealthCard" },
            /*  cardInteractIndex: cardInteractIndex, */
          };
          return newState;
        }

        case false: {
          switch (isNextTrowLast) {
            case true: {
              const newState: State = {
                ...state,
                dice: state.dice - 1,
                gameField: newGameField,
                gameState: {
                  type: "gameStarted.getOrder",
                },
                doEffect: {
                  type: "!getNextPlayer",
                },
                /* cardInteractIndex: cardInteractIndex, */
              };
              return newState;
            }

            case false: {
              const newState: State = {
                ...state,
                dice: state.dice - 1,
                gameField: newGameField,
                gameState: {
                  type: "gameStarted.clickArrow",
                  gameStartedContext: {},
                  context: {},
                },
                /*      cardInteractIndex: cardInteractIndex, */
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

export const clickArrow = (action: ActionType, state: State): State => {
  switch (action.type) {
    case "arrowPressed": {
      const direction = action.payload;
      const gameField = state.gameField;
      const isNextTrowLast = state.dice === 1;

      const playersNumber = state.numberOfPlayer;
      const prevPlayerCoord = state.cardInteractIndex[playersNumber];
      const newPlayerCoord = сhangePlayerCoord(prevPlayerCoord, direction);

      const newGameField = movePlayerInGameField(
        gameField,
        newPlayerCoord,
        prevPlayerCoord,
        playersNumber
      );

      const newCellWithPlayer = newGameField.values[newPlayerCoord];

      const cardInteractIndex = state.cardInteractIndex.map((coord, index) => {
        if (index === state.numberOfPlayer) {
          return newPlayerCoord;
        } else return coord;
      });

      const newState = getNewState(
        newCellWithPlayer,
        state,
        newGameField,
        cardInteractIndex,
        isNextTrowLast,
        newPlayerCoord
      );

      console.log("stateAfterClick", newState);
      return newState;
    }

    default: {
      return state;
    }
  }
};
