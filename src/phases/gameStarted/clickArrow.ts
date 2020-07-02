import {
  State,
  ActionType,
  MoveDirection,
  CoordItem,
  HealthItem,
} from "./../../app";

function clickArrow(action: ActionType, state: State): State {
  switch (action.type) {
    case "arrowPressed": {
      const direction = action.payload;
      const nextManCoord = changeCoord(state, direction);
      const isNextTrowLast = state.dice === 1;

      const manInField = checkCanMove(
        direction,
        state.startCoord,
        state.endCoord,
        nextManCoord
      );
      const nextCellCard = checkCell(nextManCoord, state.healthList);
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
                  manCoord: nextManCoord,
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
                      manCoord: nextManCoord,
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
                          manCoord: nextManCoord,
                          gameState: "gameStarted.trownDice",
                        };
                      } else return { ...state };
                    }
                    case !isNextTrowLast: {
                      if (state.dice != null) {
                        return {
                          ...state,
                          dice: state.dice - 1,
                          manCoord: nextManCoord,
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

const changeCoord = (state: State, direction: MoveDirection) => {
  const currManVert = state.manCoord.vert;
  const currManHor = state.manCoord.hor;
  const nextManVert = currManVert + 1;
  const nextManHor = currManHor + 1;
  const prevManVert = currManVert - 1;
  const prevManHor = currManHor - 1;

  switch (direction) {
    case "top": {
      return {
        hor: currManHor,
        vert: nextManVert,
      };
    }
    case "bottom": {
      return {
        hor: currManHor,
        vert: prevManVert,
      };
    }
    case "left": {
      return {
        hor: prevManHor,
        vert: currManVert,
      };
    }
    case "right": {
      return {
        hor: nextManHor,
        vert: currManVert,
      };
    }
    default:
      return {
        hor: currManHor,
        vert: currManVert,
      };
  }
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

const checkCell = (nextManCoord: CoordItem, healthList: Array<HealthItem>) => {
  const index = healthList.findIndex((item) => {
    return item.hor === nextManCoord.hor && item.vert === nextManCoord.vert;
  });

  if (index != -1) {
    const currItem = healthList[index];
    return currItem;
  } else return false;
};
export default clickArrow;
