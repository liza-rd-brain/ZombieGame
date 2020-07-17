import {
  State,
  ActionType,
  MoveDirection,
  CoordItem,
  FieldItem,
  StartCell,
  EndCell,
  CellType,
  GameList,
  ManItem,
} from "./../../app";

function clickArrow(action: ActionType, state: State): State {
  switch (action.type) {
    case "arrowPressed": {
      const direction = action.payload;
      const isNextTrowLast = state.dice === 1;
      const nextCell = getNextCell(state.gameList, direction);

      /*пока оставила nextManCoord для изменения листа при движении человека */
      const nextManCoord = changeCoord(state.gameList, direction);

      const gameListManMoved =
        nextManCoord != null
          ? moveMan(state.gameList, nextManCoord)
          : state.gameList;

      switch (nextCell) {
        case undefined: {
          return state;
        }
        default:
          switch (nextCell.name) {
            case "finish": {
              return {
                ...state,
                dice: state.dice - 1,
                gameList: gameListManMoved,
                gameState: "endGame",
                gameResult: "Вы выиграли",
              };
            }
            case "wall": {
              return state;
            }
            case "field": {
              const nameCell = nextCell.cardItem.find((item) => item.name);
              switch (nameCell) {
                case undefined: {
                  switch (true) {
                    case isNextTrowLast: {
                      return {
                        ...state,
                        dice: state.dice - 1,
                        gameList: gameListManMoved,
                        gameState: "gameStarted.trownDice",
                      };
                    }
                    case !isNextTrowLast: {
                      return {
                        ...state,
                        dice: state.dice - 1,
                        gameList: gameListManMoved,
                        gameState: "gameStarted.clickArrow",
                      };
                    }
                  }
                }
                default: {
                  return {
                    ...state,
                    dice: state.dice - 1,
                    gameList: gameListManMoved,
                    gameState: "gameStarted.openHealthCard",
                  };
                }
              }
            }
            default: {
              return state;
            }
          }
      }
    }
    default:
      return state;
  }
}

const changeCoord = (
  gameList: GameList,
  direction: MoveDirection
): FieldItem | null => {
  const currManCoord = gameList.flat().find((item) => {
    /*  return item.cardItem.find((item) => item.name === "man"); */
    switch (item.name) {
      case "field":
        return item.cardItem.find((item) => item.name === "man");
      default:
        return null;
    }
  });
  if (currManCoord != undefined && currManCoord.name === "field") {
    const currManVert = currManCoord.vert;
    const currManHor = currManCoord.hor;
    const nextManVert = currManVert + 1;
    const nextManHor = currManHor + 1;
    const prevManVert = currManVert - 1;
    const prevManHor = currManHor - 1;

    switch (direction) {
      case "top": {
        return {
          ...currManCoord,
          hor: currManHor,
          vert: nextManVert,
        };
      }
      case "bottom": {
        return { ...currManCoord, hor: currManHor, vert: prevManVert };
      }
      case "left": {
        return { ...currManCoord, hor: prevManHor, vert: currManVert };
      }
      case "right": {
        return { ...currManCoord, hor: nextManHor, vert: currManVert };
      }
      default:
        return { ...currManCoord, hor: currManHor, vert: currManVert };
    }
  } else return null;
};

const getNextCell = (gameList: GameList, direction: MoveDirection) => {
  const currManCell = gameList
    .flat()
    .filter((item: CellType) => {
      switch (item.name) {
        case "field":
          return item.cardItem.find((item) => item.name === "man");
        default:
          return null;
      }
    })
    .pop();

  if (currManCell) {
    const currManVert = currManCell.vert;
    const currManHor = currManCell.hor;
    const nextManVert = currManVert + 1;
    const nextManHor = currManHor + 1;
    const prevManVert = currManVert - 1;
    const prevManHor = currManHor - 1;

    return gameList
      .flat()
      .filter((item) => {
        switch (direction) {
          case "top": {
            return item.hor === currManHor && item.vert === nextManVert;
          }
          case "bottom": {
            return item.hor === currManHor && item.vert === prevManVert;
          }
          case "left": {
            return item.hor === prevManHor && item.vert === currManVert;
          }
          case "right": {
            return item.hor === nextManHor && item.vert === currManVert;
          }
        }
      })
      .pop();
  } else return undefined;
};

const moveMan = (gameList: GameList, newCoord: FieldItem) => {
  return gameList.map((item: CellType[]) => {
    return item.map((item: CellType) => {
      const isNewCoord =
        item.hor === newCoord.hor && item.vert === newCoord.vert;

      switch (item.name) {
        case "field": {
          /*  const manItem = item.cardItem.find((item) => item.name === "man"); */
          const isOldCell =
            item.cardItem.some((item) => item.name === "man") && !isNewCoord;
          const isNewCell =
            item.hor === newCoord.hor && item.vert === newCoord.vert;

          switch (true) {
            case isOldCell: {
              const cellWithoutMan: FieldItem = {
                ...item,
                cardItem: item.cardItem.filter((item) => item.name != "man"),
              };
              return cellWithoutMan;
            }

            case isNewCell: {
              const newCellWithMan: FieldItem = {
                ...item,
                cardItem: [...item.cardItem, ...newCoord.cardItem],
              };

              return newCellWithMan;
            }
          }
        }

        default:
          return item;
      }
    });
  });
};

export default clickArrow;
