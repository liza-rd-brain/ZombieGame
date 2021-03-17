import {
  CellType,
  GameList,
  СommonCell,
  openHealthCardType,
  PlayerAndHealthCell,
  State,
} from "../../types";

import { ActionType } from "../../reducer";

export const takeHealthCard = (
  action: ActionType,
  state: State,
  gameState: openHealthCardType
): State => {
  const GameList = state.GameList;
  const playerCoordIndex = gameState.context.index;
  const playerAndHealthCell: PlayerAndHealthCell =
    gameState.context.playerAndHealthCell;

  const orderPlayerIndex = state.numberOfPlayer;

  switch (action.type) {
    case "openedHealthCard": {
      const newCardInteract = openHealthCard(playerAndHealthCell);

      const newGameList = changeGameList(
        GameList,
        playerCoordIndex,
        newCardInteract
      );

      return {
        ...state,
        GameList: newGameList,
        doEffect: { type: "!changePlayerHealth" },
        gameState: {
          ...gameState,
          context: {
            ...gameState.context,
            playerAndHealthCell: newCardInteract,
          },
        },
      };
    }

    case "changedPlayerHealth": {
      const newCardInteract = changePlayerHealth(playerAndHealthCell);

      const newGameList = changeGameList(
        GameList,
        playerCoordIndex,
        newCardInteract
      );

      return {
        ...state,
        GameList: newGameList,
        doEffect: { type: "!changeHealthList" },
        gameState: {
          ...gameState,
          context: {
            ...gameState.context,
            playerAndHealthCell: newCardInteract,
          },
        },
      };
    }

    case "changedHealthList": {
      const isPlayerAlive =
        playerAndHealthCell.cardItem.playerList[0].health > 0;
      const cellWithoutHealth = changeHealthList(playerAndHealthCell);
      const newGameList = changeGameList(
        GameList,
        playerCoordIndex,
        cellWithoutHealth
      );

      switch (true) {
        case isPlayerAlive: {
          return {
            ...state,
            GameList: newGameList,
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
            GameList: newGameList,
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

const changeGameList = (
  gameList: GameList,
  playerCoordIndex: string,
  playerAndHealthCell: PlayerAndHealthCell | СommonCell
) => {
  const newGameList: [string, CellType][] = Array.from(gameList).map(
    (cell) => {
      const [index, elem] = cell;
      if (index === playerCoordIndex) {
        return [index, playerAndHealthCell];
      } else return cell;
    }
  );

  const mapWithOpenCards = new Map(newGameList);
  return mapWithOpenCards;
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
): СommonCell => {
  const { healthItem, ...otherCardItem } = playerAndHealthCell.cardItem;
  const cellWithoutHealth: CellType = {
    ...playerAndHealthCell,
    cardItem: { ...otherCardItem },
  };
  return cellWithoutHealth;
};

const changePlayerHealth = (
  playerAndHealthCell: PlayerAndHealthCell
): PlayerAndHealthCell => {
  const sign = playerAndHealthCell.cardItem.healthItem.type;
  const currHealth = playerAndHealthCell.cardItem.playerList[0].health;

  const incHealth = currHealth + 1;
  const decHealth = currHealth - 1;

  const chagedPlayerItem: PlayerAndHealthCell = {
    ...playerAndHealthCell,
    cardItem: {
      ...playerAndHealthCell.cardItem,

      //TODO: разобраться с комментарием ниже + с самим кодом, неочевидный нулевой индекс!

      //  в ячейку с карточкой здоровья может прийти только один игрок
      //   т.к. после этого он карточку заберет
      //  пока условно оставила нулевую ячейку

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
