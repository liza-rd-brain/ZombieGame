import {
  State,
  ActionType,
  MoveDirection,
 
  GameList,
} from "./../../app";



const сhangeManCoord = (currentIndex: string, direction: MoveDirection) => {
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

const moveManInArray = (
  gameList: GameList,
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
    /*убрать мутацию */
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


function clickArrow(action: ActionType, state: State): State {
  switch (action.type) {
    case "arrowPressed": {
      const direction = action.payload;
      /*  const gameList = state.gameList; */

      const GameList = state.GameList;

      /*  const prevManCoordIndex = state.cardInteractIndex; */

      const prevManCoordIndex = state.cardInteractIndex;

      const isNextTrowLast = state.dice === 1;

      /* const newManCoord = сhangeManCoord(prevManCoordIndex, direction); */

      const newManCoord = сhangeManCoord(prevManCoordIndex, direction);

      /*    const nextCell = gameList[newManCoord]; */

      const nextCell = GameList.get(newManCoord);
      console.log(nextCell);

      const hasNextCell = nextCell ? true : false;

      /* const newGameList = moveManInArray(
        gameList,
        newManCoord,
        prevManCoordIndex
      ); */

      const newGameList = moveManInArray(
        GameList,
        newManCoord,
        prevManCoordIndex
      );
      console.log(newGameList);

      switch (hasNextCell) {
        case false: {
          return state;
        }
        case true: {
          if (nextCell) {
            switch (nextCell.name) {
              case "finish": {
                return {
                  ...state,
                  dice: state.dice - 1,
                  /* gameList: newGameList, */
                  GameList: newGameList,
                  gameState: "endGame",
                  gameResult: "Вы выиграли",
                  /*   cardInteractIndex: newManCoord, */
                  cardInteractIndex: newManCoord,
                };
              }
              case "wall": {
                return state;
              }
              case "field": {
                const hasHealthInteract =
                  nextCell != undefined &&
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
                          /* gameList: newGameList, */
                          GameList: newGameList,
                          gameState: "gameStarted.trownDice",
                          /*  cardInteractIndex: newManCoord, */
                          cardInteractIndex: newManCoord,
                        };
                      }
                      case !isNextTrowLast: {
                        return {
                          ...state,
                          dice: state.dice - 1,
                          /*  gameList: newGameList, */
                          GameList: newGameList,
                          gameState: "gameStarted.clickArrow",
                          /*  cardInteractIndex: newManCoord, */
                          cardInteractIndex: newManCoord,
                        };
                      }
                    }
                  }
                  default: {
                    return {
                      ...state,
                      dice: state.dice - 1,
                      /*  gameList: newGameList, */
                      GameList: newGameList,
                      gameState: "gameStarted.openHealthCard",
                      /*  cardInteractIndex: newManCoord, */
                      cardInteractIndex: newManCoord,
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
