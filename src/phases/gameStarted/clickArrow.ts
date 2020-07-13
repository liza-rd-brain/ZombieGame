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
} from "./../../app";

function clickArrow(action: ActionType, state: State): State {
  switch (action.type) {
    case "arrowPressed": {
      const direction = action.payload;

      /* получили содержимое клетки, делаем по нему switch*/

      const isNextTrowLast = state.dice === 1;
      const nextCell = getNextCell(state.gameList, direction);
      
      /*пока оставила nextManCoord для изменения листа при движении человека */
      const nextManCoord = changeCoord(state.gameList, direction);
      const gameListManMoved: any = moveMan(state.gameList, nextManCoord);

      switch (nextCell) {
        case undefined: {
          return state;
        }
        default:
          switch (nextCell.name) {
            case "finish": {
              return {
                ...state,
                dice: state.dice /* as number */ - 1,
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
  gameList: Array<any>,
  direction: MoveDirection
): FieldItem => {
  const currManCoord = gameList.flat().find((item: FieldItem) => {
    /*  return item.cardItem.find((item) => item.name === "man"); */
    switch (item.name) {
      case "field":
        return item.cardItem.find((item) => item.name === "man");
      default:
        return null;
    }
  });
  const currManVert = currManCoord.vert;
  const currManHor = currManCoord.hor;
  const nextManVert = currManVert + 1;
  const nextManHor = currManHor + 1;
  const prevManVert = currManVert - 1;
  const prevManHor = currManHor - 1;

  switch (direction) {
    case "top": {
      return {
        hor: currManHor,
        vert: nextManVert,
        name: "field",
        cardItem: [
          {
            name: "man",
          },
        ],
      };
    }
    case "bottom": {
      return {
        hor: currManHor,
        vert: prevManVert,
        name: "field",
        cardItem: [
          {
            name: "man",
          },
        ],
      };
    }
    case "left": {
      return {
        hor: prevManHor,
        vert: currManVert,
        name: "field",
        cardItem: [
          {
            name: "man",
          },
        ],
      };
    }
    case "right": {
      return {
        hor: nextManHor,
        vert: currManVert,
        name: "field",
        cardItem: [
          {
            name: "man",
          },
        ],
      };
    }
    default:
      return {
        hor: currManHor,
        vert: currManVert,
        name: "field",
        cardItem: [
          {
            name: "man",
          },
        ],
      };
  }
};

const getNextCell = (
  gameList: GameList,
  direction: MoveDirection
) /* : CellType */ => {
  const newManCell = gameList
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

  if (newManCell) {
    const currManVert = newManCell.vert;
    const currManHor = newManCell.hor;
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

const moveMan = (gameList: GameList, coord: CoordItem) => {
  return gameList.map((item: CellType[]) => {
    return item.map((item: CellType) => {
      const isNewCoord = item.hor === coord.hor && item.vert === coord.vert;

      switch (item.name) {
        case "field": {
          const isOldCell =
            item.cardItem.some((item) => item.name === "man") && !isNewCoord;
          const isNewCell = item.hor === coord.hor && item.vert === coord.vert;
          switch (true) {
            case isOldCell: {
              return {
                ...item,
                cardItem: item.cardItem.filter((item) => item.name != "man"),
              };
            }
            case isNewCell: {
              return { ...item, cardItem: [...item.cardItem, { name: "man" }] };
            }
          }
        }

        default:
          return item;
      }
    });
  });
};

const checkCanMove = (
  direction: MoveDirection,
  startCoord: CoordItem,
  endCoord: CoordItem,
  manCoord: CoordItem
) => {
  switch (direction) {
    case "top":
      if (manCoord.vert <= endCoord.vert) {
        return true;
      } else return false;
    case "bottom":
      if (manCoord.vert >= startCoord.vert) {
        return true;
      } else return false;
    case "right":
      if (manCoord.hor <= endCoord.hor) {
        return true;
      } else return false;
    case "left":
      if (manCoord.hor >= startCoord.hor) {
        return true;
      } else return false;
    default:
      return false;
  }
};

const checkCell = (nextManCoord: CoordItem, gameList: GameList): any => {
  return gameList.flat().find((item: CellType) => {
    if (item.hor === nextManCoord.hor && item.vert === nextManCoord.vert) {
      switch (item.name) {
        case "field": {
          return item.cardItem.find((item) => {
            return item.name === "health";
          });
        }
        case "wall": {
          return item;
        }
      }
    } else return false;
  });
};
export default clickArrow;
