import {
  State,
  ActionType,
  MoveDirection,
  GameList,
  GameListMap,
} from "./../../app";

/* const сhangeManCoord = (currentIndex: string, direction: MoveDirection) => {
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
}; */

const сhangeManCoordMap = (currentIndex: string, direction: MoveDirection) => {
  const currManHor = parseInt(currentIndex.split(".")[0]);
  const currManVert = parseInt(currentIndex.split(".")[1]);

  const nextManVert = currManVert + 1;
  const nextManHor = currManHor + 1;

  const prevManVert = currManVert - 1;
  const prevManHor = currManHor - 1;

  switch (direction) {
    case "top": {
      return `${currManHor}.${nextManVert}`;
    }
    case "bottom": {
      return `${currManHor}.${prevManVert}`;
    }
    case "left": {
      return `${prevManHor}.${currManVert}`;
    }
    case "right": {
      return `${nextManHor}.${currManVert}`;
    }
    default:
      return `${currManHor}.${currManVert}`;
  }
};

const moveManInArrayMap = (
  gameList: GameListMap,
  newIndex: string,
  prevIndex: string
) => {
  const prevCell = gameList.get(prevIndex);

  const nextCell = gameList.get(newIndex);

  if (
    prevCell &&
    nextCell &&
    prevCell.name === "field" &&
    nextCell.name === "field"
  ) {
    const man = prevCell.cardItem.manItem;
    delete prevCell.cardItem.manItem;
    nextCell.cardItem = {
      ...nextCell.cardItem,
      manItem: man,
    };

    const obj = new Map(gameList);
    obj.set(prevIndex, prevCell);
    obj.set(newIndex, nextCell);

    return obj;
  } else if (
    /*проверка на финиш*/
    nextCell &&
    prevCell &&
    prevCell.name === "field" &&
    nextCell.name === "finish"
  ) {
    const man = prevCell.cardItem.manItem;
    delete prevCell.cardItem.manItem;
    nextCell.cardItem = {
      ...nextCell.cardItem,
      manItem: man,
    };

    const obj = new Map(gameList);
    obj.set(prevIndex, prevCell);
    obj.set(newIndex, nextCell);

    return obj;
  } else return gameList;
};

/* const moveManInArray = (
  gameList: GameList,
  newIndex: string,
  prevIndex: string
) => {
  const prevCell = gameList[prevIndex];
  const nextCell = gameList[newIndex];

  if (nextCell && prevCell.name === "field" && nextCell.name === "field") {
    const man = prevCell.cardItem.manItem;
    delete prevCell.cardItem.manItem;
    nextCell.cardItem = {
      ...nextCell.cardItem,
      manItem: man,
    };

    const obj = { ...gameList, [prevIndex]: prevCell, [newIndex]: nextCell };

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

    return obj;
  } else return gameList;
};
 */
function clickArrow(action: ActionType, state: State): State {
  switch (action.type) {
    case "arrowPressed": {
      const direction = action.payload;
      /*  const gameList = state.gameList; */

      const gameListMap = state.gameListMap;

      /*  const prevManCoordIndex = state.cardInteractIndex; */

      const prevManCoordIndexMap = state.cardInteractIndexMap;

      const isNextTrowLast = state.dice === 1;

      /* const newManCoord = сhangeManCoord(prevManCoordIndex, direction); */

      const newManCoordMap = сhangeManCoordMap(prevManCoordIndexMap, direction);

      /*    const nextCell = gameList[newManCoord]; */

      const nextCellMap = gameListMap.get(newManCoordMap);
      console.log(nextCellMap);

      const hasNextCell = nextCellMap ? true : false;

      /* const newGameList = moveManInArray(
        gameList,
        newManCoord,
        prevManCoordIndex
      ); */

      const newGameListMap = moveManInArrayMap(
        gameListMap,
        newManCoordMap,
        prevManCoordIndexMap
      );
      console.log(newGameListMap);

      switch (hasNextCell) {
        case false: {
          return state;
        }
        case true: {
          if (nextCellMap) {
            switch (nextCellMap.name) {
              case "finish": {
                return {
                  ...state,
                  dice: state.dice - 1,
                  /* gameList: newGameList, */
                  gameListMap: newGameListMap,
                  gameState: "endGame",
                  gameResult: "Вы выиграли",
                  /*   cardInteractIndex: newManCoord, */
                  cardInteractIndexMap: newManCoordMap,
                };
              }
              case "wall": {
                return state;
              }
              case "field": {
                const hasHealthInteract =
                  nextCellMap != undefined &&
                  nextCellMap.cardItem.healthItem != undefined;
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
                          /* gameList: newGameList, */
                          gameListMap: newGameListMap,
                          gameState: "gameStarted.trownDice",
                          /*  cardInteractIndex: newManCoord, */
                          cardInteractIndexMap: newManCoordMap,
                        };
                      }
                      case !isNextTrowLast: {
                        return {
                          ...state,
                          dice: state.dice - 1,
                          /*  gameList: newGameList, */
                          gameListMap: newGameListMap,
                          gameState: "gameStarted.clickArrow",
                          /*  cardInteractIndex: newManCoord, */
                          cardInteractIndexMap: newManCoordMap,
                        };
                      }
                    }
                  }
                  default: {
                    return {
                      ...state,
                      dice: state.dice - 1,
                      /*  gameList: newGameList, */
                      gameListMap: newGameListMap,
                      gameState: "gameStarted.openHealthCard",
                      /*  cardInteractIndex: newManCoord, */
                      cardInteractIndexMap: newManCoordMap,
                    };
                  }
                }
              }
              default: {
                return state;
              }
            }
          } else return state;
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
