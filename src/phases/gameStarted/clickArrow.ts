import {
  State,
  ActionType,
  MoveDirection,
  CoordItem,
  CurrentHealthItem,
  ManItem,
} from "./../../app";

function clickArrow(action: ActionType, state: State): State {
  switch (action.type) {
    case "arrowPressed": {
      const direction = action.payload;
      const nextManCoord = changeCoord(state.gameList, direction);
      const gameListManMoved: any = moveMan(state.gameList, nextManCoord);
      const isNextTrowLast = state.dice === 1;

      const manInField = checkCanMove(
        direction,
        state.startCoord,
        state.endCoord,
        nextManCoord
      );
      const nextCellCard = checkCell(nextManCoord, state.gameList);
      const nextCellHasCard = nextCellCard ? true : false;

      const isNextCellFinish =
        nextManCoord.hor === state.endCoord.hor &&
        nextManCoord.vert === state.endCoord.vert;

      switch (true) {
        case manInField: {
          switch (true) {
            case nextCellHasCard: {
              if (state.dice != null) {
                return {
                  ...state,
                  dice: state.dice - 1,
                  /* manCoord: nextManCoord, */
                  gameList: gameListManMoved,
                  cardInteract: nextCellCard,
                  gameState: "gameStarted.openHealthCard",
                };
              } else return { ...state };
            }
            case !nextCellHasCard: {
              switch (true) {
                case isNextCellFinish: {
                  if (state.dice != null) {
                    return {
                      ...state,
                      dice: state.dice - 1,
                      /* manCoord: nextManCoord, */
                      gameList: gameListManMoved,
                      gameState: "endGame",
                      gameResult: "Вы выиграли",
                    };
                  } else return { ...state };
                }
                case !isNextCellFinish: {
                  switch (true) {
                    case isNextTrowLast: {
                      if (state.dice != null) {
                        return {
                          ...state,
                          dice: state.dice - 1,
                          /* manCoord: nextManCoord, */
                          gameList: gameListManMoved,
                          gameState: "gameStarted.trownDice",
                        };
                      } else return { ...state };
                    }
                    case !isNextTrowLast: {
                      if (state.dice != null) {
                        return {
                          ...state,
                          dice: state.dice - 1,
                          /*     manCoord: nextManCoord, */
                          gameList: gameListManMoved,
                          gameState: "gameStarted.clickArrow",
                        };
                      } else return { ...state };
                    }
                  }
                }
              }
            }
          }
        }
        case !manInField: {
          return { ...state };
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
): ManItem => {
  const currManCoord = gameList.flat().find((item: any) => {
    return item.man;
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
        man: true,
      };
    }
    case "bottom": {
      return {
        hor: currManHor,
        vert: prevManVert,
        man: true,
      };
    }
    case "left": {
      return {
        hor: prevManHor,
        vert: currManVert,
        man: true,
      };
    }
    case "right": {
      return {
        hor: nextManHor,
        vert: currManVert,
        man: true,
      };
    }
    default:
      return {
        hor: currManHor,
        vert: currManVert,
        man: true,
      };
  }
};
const moveMan = (gameList: Array<any>, coord: CoordItem) => {
  return gameList.map((item) => {
    return item.map((item: any) => {
      if (item.man) {
        delete item.man;
        return item;
      } else if (item.hor === coord.hor && item.vert === coord.vert) {
        item.man = true;
        return item;
      } else return item;
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

const checkCell = (nextManCoord: CoordItem, gameList: any): any => {
  return gameList.flat().find((item: any) => {
    if (item.hor === nextManCoord.hor && item.vert === nextManCoord.vert) {
      return item.health ? item : false;
    } else return false;
  });
};
export default clickArrow;
