import {
  CommonCell,
  openHealthCardType,
  HealthCell,
  State,
  GameField,
  NewPlayersList,
  CellType,
} from "../../types";

import { ActionType } from "../../reducer";

export const takeHealthCard = (
  action: ActionType,
  state: State,
  gameState: openHealthCardType
): State => {
  const gameField = state.gameField;
  const numberOfPlayer = state.numberOfPlayer;
  const playerCoordIndex = state.playersList[numberOfPlayer].coord;
  const healthCell = gameField.values[playerCoordIndex];

  console.log(healthCell);

  const playerList = state.playersList;

  switch (action.type) {
    case "openedHealthCard": {
      const cellWithOpenHealth = openHealthCard(healthCell);

      const newGameField: GameField = {
        ...gameField,
        values: { ...gameField.values, [playerCoordIndex]: cellWithOpenHealth },
      };

      return {
        ...state,
        gameField: newGameField,
        doEffect: { type: "!changePlayerHealth" },
      };
    }

    case "changedPlayerHealth": {
      const changedPlayerList = changePlayerHealth(
        healthCell,
        playerList,
        numberOfPlayer
      );

      return {
        ...state,
        doEffect: { type: "!changeHealthList" },
        playersList: changedPlayerList,
      };
    }

    case "changedHealthList": {
      /*  const isPlayerAlive = healthCell.cardItem.playerList[0].health > 0; */
      const isPlayerAlive = playerList[numberOfPlayer].health > 0;
      const cellWithoutHealthCard = changeHealthList(healthCell);

      const newGameField: GameField = {
        ...gameField,
        values: {
          ...gameField.values,
          [playerCoordIndex]: cellWithoutHealthCard,
        },
      };

      switch (true) {
        case isPlayerAlive: {
          return {
            ...state,
            gameField: newGameField,
            gameState: {
              type: "gameStarted.getOrder",
            },
            doEffect: {
              type: "!getNextPlayer",
            },
            dice: 0,
          };
        }

        case !isPlayerAlive: {
          return {
            ...state,
            gameField: newGameField,
            gameState: { type: "endGame" },
            gameResult: "Вы проиграли",
            doEffect: null,
          };
        }

        default:
          return { ...state };
      }
    }

    default:
      return { ...state };
  }
};

const openHealthCard = (healthCell: CellType): CellType => {
  if (healthCell.name === "commonCell" && healthCell.cardItem.healthItem) {
    const openedItem: HealthCell = {
      ...healthCell,
      cardItem: {
        ...healthCell.cardItem,
        healthItem: {
          ...healthCell.cardItem.healthItem,
          apperance: "open",
        },
      },
    };
    return openedItem;
  } else {
    return healthCell;
  }
};

const changeHealthList = (healthCell: CellType): CellType => {
  if (healthCell.name === "commonCell" && healthCell.cardItem.healthItem) {
    const { healthItem, ...otherCardItem } = healthCell.cardItem;

    const cellWithoutHealth: CommonCell = {
      ...healthCell,
      cardItem: { ...otherCardItem },
    };
    return cellWithoutHealth;
  } else return healthCell;
};

const changePlayerHealth = (
  healthCell: CellType,
  playerList: NewPlayersList,
  numberOfPlayer: number
) => {
  if (healthCell.name === "commonCell" && healthCell.cardItem.healthItem) {
    const sign = healthCell.cardItem.healthItem.type;
    // TODO:  заранее поятно, что едиственная карточка лежит в массиве
    const currHealth = { ...playerList }[numberOfPlayer].health;

    const incHealth = currHealth + 1;
    const decHealth = currHealth - 1;

    const changedPlayerList: NewPlayersList = {
      ...playerList,
      [numberOfPlayer]: {
        ...playerList[numberOfPlayer],
        health: sign === "decrement" ? decHealth : incHealth,
      },
    };

    return changedPlayerList;
  } else {
    return playerList;
  }
};
