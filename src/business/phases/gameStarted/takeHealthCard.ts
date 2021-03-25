import {
  CommonCell,
  openHealthCardType,
  PlayerAndHealthCell,
  State,
  GameField,
} from "../../types";

import { ActionType } from "../../reducer";

export const takeHealthCard = (
  action: ActionType,
  state: State,
  gameState: openHealthCardType
): State => {
  const gameField = state.gameField;
  const playerCoordIndex = gameState.context.index;

  const playerAndHealthCell: PlayerAndHealthCell =
    gameState.context.playerAndHealthCell;

  switch (action.type) {
    case "openedHealthCard": {
      const cellWithOpenHealth = openHealthCard(playerAndHealthCell);

      const newGameField: GameField = {
        ...gameField,
        values: { ...gameField.values, [playerCoordIndex]: cellWithOpenHealth },
      };

      return {
        ...state,
        gameField: newGameField,
        doEffect: { type: "!changePlayerHealth" },
        gameState: {
          ...gameState,
          context: {
            ...gameState.context,
            playerAndHealthCell: cellWithOpenHealth,
          },
        },
      };
    }

    case "changedPlayerHealth": {
      const cellWithChangedPLayerHealth = changePlayerHealth(
        playerAndHealthCell
      );

      const newGameField: GameField = {
        ...gameField,
        values: {
          ...gameField.values,
          [playerCoordIndex]: cellWithChangedPLayerHealth,
        },
      };

      return {
        ...state,
        gameField: newGameField,
        doEffect: { type: "!changeHealthList" },
        gameState: {
          ...gameState,
          context: {
            ...gameState.context,
            playerAndHealthCell: cellWithChangedPLayerHealth,
          },
        },
      };
    }

    case "changedHealthList": {
      const isPlayerAlive =
        playerAndHealthCell.cardItem.playerList[0].health > 0;

      const cellWithoutHealthCard = changeHealthList(playerAndHealthCell);

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
            gameState: { type: "endGame", context: {} },
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

const openHealthCard = (
  playerAndHealthCell: PlayerAndHealthCell
): PlayerAndHealthCell => {
  const openedItem: PlayerAndHealthCell = {
    ...playerAndHealthCell,
    cardItem: {
      ...playerAndHealthCell.cardItem,
      healthItem: {
        ...playerAndHealthCell.cardItem.healthItem,
        apperance: "open",
      },
    },
  };

  return openedItem;
};

const changeHealthList = (
  playerAndHealthCell: PlayerAndHealthCell
): CommonCell => {
  const { healthItem, ...otherCardItem } = playerAndHealthCell.cardItem;

  const cellWithoutHealth: CommonCell = {
    ...playerAndHealthCell,
    cardItem: { ...otherCardItem },
  };
  return cellWithoutHealth;
};

const changePlayerHealth = (
  playerAndHealthCell: PlayerAndHealthCell
): PlayerAndHealthCell => {
  const sign = playerAndHealthCell.cardItem.healthItem.type;
  // TODO:  заранее поятно, что едиственная карточка лежит в массиве
  const currHealth = playerAndHealthCell.cardItem.playerList[0].health;

  const incHealth = currHealth + 1;
  const decHealth = currHealth - 1;

  const chagedPlayerItem: PlayerAndHealthCell = {
    ...playerAndHealthCell,
    cardItem: {
      ...playerAndHealthCell.cardItem,
      playerList: [
        {
          ...playerAndHealthCell.cardItem.playerList[0],
          health: sign === "decrement" ? decHealth : incHealth,
        },
      ],
    },
  };
  return chagedPlayerItem;
};
