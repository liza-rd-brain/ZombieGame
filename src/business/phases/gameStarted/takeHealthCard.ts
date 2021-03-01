import {
  GameState,
  ObjCellType,
  GameList,
  ObjFieldItem,
  ManItem,
  HealthItem,
  TypeEffect,
  openHealthCardType,
  ManAndHealthFieldItem,
  State,
} from "../../types";

import { ActionType } from "../../reducer";

//пока нужно для вывода здоровья на экране
/* export const getManHealth = (gameList: GameList, manCoordIndex: string) => {
  const cellWithMan = gameList.get(manCoordIndex);

  if (cellWithMan && cellWithMan.name === "field") {
    if (cellWithMan.cardItem.manList) {
      return cellWithMan.cardItem.manList[0].health;
    } else return 0;
  } else return 0;
}; */

//переименовать в takeHealthCard-?!
function takeHealthCard(
  action: ActionType,
  state: State,
  gameState: openHealthCardType
): State {
  const GameList = state.GameList;
  const manCoordIndex = gameState.context.index;
  const manAndHealthCell: ManAndHealthFieldItem =
    gameState.context.manAndHealthCell;

  const orderManIndex = state.numberOfMan;
  switch (action.type) {
    case "openedHealthCard": {
      const newCardInteract = openHealthCard(manAndHealthCell);

      const newGameList = changeGameList(
        GameList,
        manCoordIndex,
        newCardInteract
      );

      return {
        ...state,
        GameList: newGameList,
        doEffect: { type: "!changeManHealth" },
        gameState: {
          ...gameState,
          context: { ...gameState.context, manAndHealthCell: newCardInteract },
        },
      };
    }

    case "changedManHealth": {
      const newCardInteract = changeManHealth(manAndHealthCell, orderManIndex);

      const newGameList = changeGameList(
        GameList,
        manCoordIndex,
        newCardInteract
      );
      return {
        ...state,
        GameList: newGameList,
        doEffect: { type: "!changeHealthList" },
        gameState: {
          ...gameState,
          context: { ...gameState.context, manAndHealthCell: newCardInteract },
        },
      };
    }

    case "changedHealthList": {
      //проверка на потерю жизней
      const isManLiveObj = manAndHealthCell.cardItem.manList[0].health > 0;
      const cellWithoutHealth = changeHealthList(manAndHealthCell);
      const newGameList = changeGameList(
        GameList,
        manCoordIndex,
        cellWithoutHealth
      );

      switch (true) {
        case isManLiveObj: {
          return {
            ...state,
            GameList: newGameList,
            gameState: {
              type: "gameStarted.getOrder",
            },
            doEffect: {
              type: "!getNextMan",
            },
            dice: 0,
          };
        }
        case !isManLiveObj: {
          return {
            ...state,
            GameList: newGameList,
            gameState: { type: "endGame", context: {} },
            gameResult: "Вы проиграли",
            doEffect: null,
          };
        }
      }
    }
    default:
      return { ...state };
  }
}

const changeGameList = (
  gameList: GameList,
  manCoordIndex: string,
  manAndHealthCell: ManAndHealthFieldItem | ObjFieldItem
) => {
  const newGameList: [string, ObjCellType][] = Array.from(gameList).map(
    (item) => {
      const [index, elem] = item;
      if (index === manCoordIndex) {
        return [index, manAndHealthCell];
      } else return item;
    }
  );
  const mapWithOpenCards = new Map(newGameList);

  return mapWithOpenCards;
};

const openHealthCard = (
  manAndHealthCell: ManAndHealthFieldItem
): ManAndHealthFieldItem => {
  const openedItem: ManAndHealthFieldItem = {
    ...manAndHealthCell,
    cardItem: {
      ...manAndHealthCell.cardItem,
      healthItem: {
        ...manAndHealthCell.cardItem.healthItem,
        apperance: "open",
      },
    },
  };
  return openedItem;
};

const changeHealthList = (
  manAndHealthCell: ManAndHealthFieldItem
): ObjFieldItem => {
  const { healthItem, ...otherCardItem } = manAndHealthCell.cardItem;
  const cellWithoutHealth: ObjCellType = {
    ...manAndHealthCell,
    cardItem: { ...otherCardItem },
  };
  return cellWithoutHealth;
};

const changeManHealth = (
  manAndHealthCell: ManAndHealthFieldItem,
  orderManIndex: number
): ManAndHealthFieldItem => {
  const sign = manAndHealthCell.cardItem.healthItem.type;
  const currHealth = manAndHealthCell.cardItem.manList[0].health;

  const incHealth = currHealth + 1;
  const decHealth = currHealth - 1;

  const chagedManItem: ManAndHealthFieldItem = {
    ...manAndHealthCell,
    cardItem: {
      ...manAndHealthCell.cardItem,

      // в ячейку с карточкой здоровья может прийти только один игрок
      //т.к. после этого он карточку заберет
      //пока условно оставила нулевую ячейку
      manList: [
        {
          ...manAndHealthCell.cardItem.manList[0],
          health: sign === "decrement" ? decHealth : incHealth,
        },
      ],
    },
  };
  return chagedManItem;
};

export default takeHealthCard;
