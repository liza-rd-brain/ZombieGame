import { State, ActionType, MoveDirection, GameList } from "./../../app";

const сhangeManCoord = (currentIndex: string, direction: MoveDirection) => {
  const currManHor = +(currentIndex[0] ? currentIndex[0] : 0);
  const currManVert = +(currentIndex[1] ? currentIndex[1] : 0);
  const nextManVert = currManVert + 1;
  const nextManHor = currManHor + 1;

  const prevManVert = currManVert - 1;
  const prevManHor = currManHor - 1;

  switch (direction) {
    case "top": {
      return `${currManHor}${nextManVert}`;
    }
    case "bottom": {
      return `${currManHor}${prevManVert}`;
    }
    case "left": {
      return `${prevManHor}${currManVert}`;
    }
    case "right": {
      return `${nextManHor}${currManVert}`;
    }
    default:
      return `${currManHor}${currManVert}`;
  }
};

const moveManInArray = (
  gameList: GameList,
  newIndex: string,
  prevIndex: string
) => {
  const prevCell = gameList[prevIndex];
  const nextCell = gameList[newIndex];
  console.log(prevCell, nextCell);

  if (nextCell && prevCell.name === "field" && nextCell.name === "field") {
    const man = prevCell.cardItem.manItem;
    delete prevCell.cardItem.manItem;
    nextCell.cardItem = {
      ...nextCell.cardItem,
      manItem: man,
    };

    const obj = { ...gameList, [prevIndex]: prevCell, [newIndex]: nextCell };
    console.log(obj);
    return obj;
  } else if (
    nextCell &&
    prevCell.name === "field" &&
    nextCell.name === "finish"
  ) {
    const man = prevCell.cardItem.manItem;
    delete prevCell.cardItem.manItem;
    nextCell.cardItem = {
      ...nextCell.cardItem,
      manItem: man,
    };

    const obj = { ...gameList, [prevIndex]: prevCell, [newIndex]: nextCell };
    console.log(obj);
    return obj;
  } else return gameList;
};

function clickArrow(action: ActionType, state: State): State {
  switch (action.type) {
    case "arrowPressed": {
      const direction = action.payload;
      const gameList = state.gameList;
      const prevManCoordIndex = state.cardInteractIndex;

      /* const prevManCoord = state.cardInteractIndex; */
      const isNextTrowLast = state.dice === 1;

      const newManCoord = сhangeManCoord(prevManCoordIndex, direction);

      const nextCell = gameList[newManCoord];
      const hasNextCell = nextCell ? true : false;

      const newGameList = moveManInArray(
        gameList,
        newManCoord,
        prevManCoordIndex
      );

      switch (hasNextCell) {
        case false: {
          return state;
        }
        case true: {
          switch (nextCell.name) {
            case "finish": {
              return {
                ...state,
                dice: state.dice - 1,

                gameList: newGameList,
                gameState: "endGame",
                gameResult: "Вы выиграли",
                cardInteractIndex: newManCoord,
              };
            }
            case "wall": {
              return state;
            }
            case "field": {
              const hasHealthInteract =
                nextCell.cardItem.healthItem != undefined;
              /*   const hasHealthInteract = nextCell.cardItem.find(
              (item) => item.name === "health"
            ); */

              switch (hasHealthInteract) {
                case false: {
                  switch (true) {
                    case isNextTrowLast: {
                      return {
                        ...state,
                        dice: state.dice - 1,

                        gameList: newGameList,
                        gameState: "gameStarted.trownDice",
                        cardInteractIndex: newManCoord,
                      };
                    }
                    case !isNextTrowLast: {
                      return {
                        ...state,
                        dice: state.dice - 1,

                        gameList: newGameList,
                        gameState: "gameStarted.clickArrow",
                        cardInteractIndex: newManCoord,
                      };
                    }
                  }
                }
                default: {
                  return {
                    ...state,
                    dice: state.dice - 1,

                    gameList: newGameList,
                    gameState: "gameStarted.openHealthCard",
                    cardInteractIndex: newManCoord,
                  };
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
    }
    default: {
      return state;
    }
  }
}

export default clickArrow;
