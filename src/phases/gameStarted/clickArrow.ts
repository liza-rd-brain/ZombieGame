import Health from "../../features/Health";
import {
  State,
  ActionType,
  MoveDirection,
  ObjCellType,
  GameList,
  ManItem,
  HealthItem,
  ManAndHealthFieldItem,
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
  nextIndex: string,
  prevIndex: string
) => {
  const prevCell = gameList.get(prevIndex);
  const nextCell = gameList.get(nextIndex);
  //если ячейки есть?! и это поля, в смысле не стены?!?
  if (
    prevCell &&
    nextCell &&
    prevCell.name === "field" &&
    (nextCell.name === "field" || nextCell.name === "finish")
  ) {
    const { manItem: man, ...otherCardItem } = { ...prevCell.cardItem };
    const newPrevCell = { ...prevCell, cardItem: otherCardItem };
    const newNextCell = {
      ...nextCell,
      cardItem: { ...nextCell.cardItem, manItem: man },
    };

    const newGameList: [string, ObjCellType][] = Array.from(gameList).map(
      (item) => {
        const [index, elem] = item;
        switch (index) {
          case prevIndex: {
            return [index, newPrevCell];
          }
          case nextIndex: {
            return [index, newNextCell];
          }
          default: {
            return item;
          }
        }
      }
    );

    const newMap = new Map(newGameList);

    return newMap;
  } else return gameList;
};

function clickArrow(action: ActionType, state: State): State {
  switch (action.type) {
    case "arrowPressed": {
      const direction = action.payload;
      const GameList = state.GameList;
      const prevManCoordIndex = state.cardInteractIndex;
      const isNextTrowLast = state.dice === 1;

      const newManCoord = сhangeManCoord(prevManCoordIndex, direction);

      const nextCell = GameList.get(newManCoord);
      const hasNextCell = nextCell ? true : false;

      const newGameList = moveManInArray(
        GameList,
        newManCoord,
        prevManCoordIndex
      );
      console.log(newGameList);

      const newNextCell = newGameList.get(newManCoord);

      //упрощение - все равно выглядит как портянка
      //если есть следующая ячейка
      if (/* nextCell&& */ newNextCell) {
        switch (newNextCell.name) {
          case "finish": {
            return {
              ...state,
              dice: state.dice - 1,
              GameList: newGameList,
              //может нужно будет пробросить item для статистики  в конце игры
              gameState: { type: "endGame", context: {} },
              gameResult: "Вы выиграли",
              cardInteractIndex: newManCoord,
            };
          }
          case "wall": {
            return state;
          }
          case "field": {
            /*    const hasHealthInteract = nextCell.cardItem.healthItem != undefined; */
            //можно брать ячейку уже из итогового массива
            const manAndHealthCell = newNextCell;
            const hasManAndHealthCell =
              manAndHealthCell.cardItem.healthItem != undefined &&
              manAndHealthCell.cardItem.manItem != undefined;
            /*    const manAndHealthCell = newNextCell.cardItem.healthItem; */
            switch (hasManAndHealthCell) {
              case true: {
                return {
                  ...state,
                  dice: state.dice - 1,
                  GameList: newGameList,
                  gameState: {
                    type: "gameStarted.openHealthCard",
                    /*  gameStartedContext: {
                      index: newManCoord,
                      manAndHealthCell: manAndHealthCell as ManAndHealthFieldItem,
                    }, */
                    context: {
                      index: newManCoord,
                      manAndHealthCell: manAndHealthCell as ManAndHealthFieldItem,
                    },
                  },
                  doEffect: { type: "!needOpenHealthCard" },
                  cardInteractIndex: newManCoord,
                  /* manAndHealthItemBuffer: { index, cell: ManAnd } */
                };
              }
              case false: {
                switch (isNextTrowLast) {
                  case true: {
                    return {
                      ...state,
                      dice: state.dice - 1,
                      GameList: newGameList,
                      gameState: { type: "gameStarted.trownDice", context: {} },
                      cardInteractIndex: newManCoord,
                    };
                  }
                  case false: {
                    return {
                      ...state,
                      dice: state.dice - 1,
                      GameList: newGameList,
                      gameState: {
                        type: "gameStarted.clickArrow",
                        /* gameStartedContext: {}, */
                        context: {},
                      },
                      cardInteractIndex: newManCoord,
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
}

export default clickArrow;
