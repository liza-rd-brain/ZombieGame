import {
  MoveDirection,
  CellType,
  GameList,
  PlayerAndHealthCell,
  State,
} from "../../types";
import { ActionType } from "../../reducer";

const сhangePlayerCoord = (currentIndex: string, direction: MoveDirection) => {
  const currPlayerHor = parseInt(currentIndex.split(".")[0]);
  const currPlayerVert = parseInt(currentIndex.split(".")[1]);
  const nextPlayerVert = currPlayerVert + 1;
  const nextPlayerHor = currPlayerHor + 1;
  const prevPlayerVert = currPlayerVert - 1;
  const prevPlayerHor = currPlayerHor - 1;

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

const movePlayerInArray = (
  gameList: GameList,
  nextIndex: string,
  prevIndex: string,
  orderPlayerIndex: number
) => {
  const prevCell = gameList.get(prevIndex);
  const nextCell = gameList.get(nextIndex);
  //TODO: исправить сложное нечитаемое условие
  if (
    prevCell &&
    nextCell &&
    prevCell.name === "commonCell" &&
    (nextCell.name === "commonCell" || nextCell.name === "finish")
  ) {
    const { playerList, ...otherCardItem } = { ...prevCell.cardItem };
    const newCellPlayer =
      playerList?.filter((player) => {
        return player.orderNumber === orderPlayerIndex;
      }) || [];

    const prevCellPlayer =
      playerList?.filter((player) => {
        return player.orderNumber != orderPlayerIndex;
      }) || [];

    const newPrevCell = {
      ...prevCell,
      cardItem: { ...otherCardItem, playerList: prevCellPlayer },
    };

    //в текущую ячейку складываем все что было + новый Player
    const newNextCell: CellType = {
      ...nextCell,
      cardItem: {
        ...nextCell.cardItem,
        playerList: nextCell.cardItem.playerList
          ? nextCell.cardItem.playerList?.concat(newCellPlayer)
          : newCellPlayer,
      },
    };

    const newGameList: [string, CellType][] = Array.from(gameList).map(
      (cell) => {
        const [index, elem] = cell;
        switch (index) {
          case prevIndex: {
            return [index, newPrevCell];
          }
          case nextIndex: {
            return [index, newNextCell];
          }
          default: {
            return cell;
          }
        }
      }
    );

    return new Map(newGameList);
  } else return gameList;
};

export const clickArrow = (action: ActionType, state: State): State => {
  switch (action.type) {
    case "arrowPressed": {
      const direction = action.payload;
      const gameList = state.GameList;
      /* const GameField = state.GameField; */
      const orderPlayerIndex = state.numberOfPlayer;
      const prevPlayerCoordIndex = state.cardInteractIndex[orderPlayerIndex];
      const isNextTrowLast = state.dice === 1;

      const newPlayerCoord = сhangePlayerCoord(prevPlayerCoordIndex, direction);
      const newGameList = movePlayerInArray(
        gameList,
        newPlayerCoord,
        prevPlayerCoordIndex,
        state.numberOfPlayer
      );
      const newNextCell = newGameList.get(newPlayerCoord);
      const cardInteractIndex = state.cardInteractIndex.map((coord, index) => {
        if (index === state.numberOfPlayer) {
          return newPlayerCoord;
        } else return coord;
      });

      if (newNextCell) {
        switch (newNextCell.name) {
          case "finish": {
            return {
              ...state,
              dice: state.dice - 1,
              GameList: newGameList,
              gameState: { type: "endGame", context: {} },
              gameResult: "Вы выиграли",
              cardInteractIndex: cardInteractIndex,
            };
          }

          case "wall": {
            return state;
          }

          case "commonCell": {
            const playerAndHealthCell = newNextCell;
            const hasPlayerAndHealthCell =
              playerAndHealthCell.cardItem.healthItem != undefined &&
              playerAndHealthCell.cardItem.playerList != undefined;

            switch (hasPlayerAndHealthCell) {
              case true: {
                return {
                  ...state,
                  dice: state.dice - 1,
                  GameList: newGameList,
                  gameState: {
                    type: "gameStarted.takeHealthCard",
                    context: {
                      index: newPlayerCoord,
                      //TODO:уйти от assertion
                      playerAndHealthCell: playerAndHealthCell as PlayerAndHealthCell,
                    },
                  },
                  doEffect: { type: "!needOpenHealthCard" },
                  cardInteractIndex: cardInteractIndex,
                };
              }

              case false: {
                switch (isNextTrowLast) {
                  case true: {
                    return {
                      ...state,
                      dice: state.dice - 1,
                      GameList: newGameList,
                      gameState: {
                        type: "gameStarted.getOrder",
                      },
                      doEffect: {
                        type: "!getNextPlayer",
                      },
                      cardInteractIndex: cardInteractIndex,
                    };
                  }

                  case false: {
                    return {
                      ...state,
                      dice: state.dice - 1,
                      GameList: newGameList,
                      gameState: {
                        type: "gameStarted.clickArrow",
                        gameStartedContext: {},
                        context: {},
                      },
                      cardInteractIndex: cardInteractIndex,
                    };
                  }
                }
              }
            }
          }

          default: {
            return state;
          }
        }
      } else {
        return state;
      }
    }

    default: {
      return state;
    }
  }
};
