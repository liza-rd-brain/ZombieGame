import { State, ActionType, MoveDirection, GameList } from "./../../app";

function clickArrow(action: ActionType, state: State): State {
  switch (action.type) {
    case "arrowPressed": {
      const direction = action.payload;
      const gameList = state.gameList;
      const prevManCoord = state.cardInteractIndex;
      const isNextTrowLast = state.dice === 1;

      const newManCoord = сhangeManCoord(prevManCoord, direction);

      const nextCell = gameList.flat()[parseInt(newManCoord)];

      const newGameList = moveManInArray(gameList, newManCoord, prevManCoord);

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
          const hasHealthInteract = nextCell.cardItem.find(
            (item) => item.name === "health"
          );

          switch (hasHealthInteract) {
            case undefined: {
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
    default:
      return state;
  }
}

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
  const prevCell = gameList.flat()[parseInt(prevIndex)];
  const nextCell = gameList.flat()[parseInt(newIndex)];

  if (prevCell.name === "field" && nextCell.name === "field") {
    const changingPrevCell =
      prevCell.name === "field"
        ? prevCell.cardItem.filter((item) => {
            return item.name != "man";
          })
        : [];

    const healthItem =
      prevCell.name === "field"
        ? prevCell.cardItem.find((item) => item.name === "man")
        : null;

    const changingNextCell =
      nextCell.name === "field" && healthItem != null
        ? (nextCell.cardItem = [...nextCell.cardItem, healthItem])
        : [];

    prevCell.cardItem = changingPrevCell;
    nextCell.cardItem = changingNextCell;

    const outerPrevIndex = parseInt(prevIndex[0]);
    const outerNextIndex = parseInt(newIndex[0]);
    const innerPrevIndex = parseInt(prevIndex[1]);
    const innerNextIndex = parseInt(newIndex[1]);

    const newArray = [...gameList];
    newArray[outerPrevIndex][innerPrevIndex] = prevCell;
    newArray[outerNextIndex][innerNextIndex] = nextCell;

    return newArray;
  } else return gameList;
};

export default clickArrow;
