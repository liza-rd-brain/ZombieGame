import { State, GameField, PlayerListType, CommonCell } from "../../../types";

import { ActionType } from "../../../reducer";
import { openCard } from "../openCard";
import { deleteCard } from "./deleteCard";

export const takeCard = (action: ActionType, state: State): State => {
  switch (action.type) {
    case "req-openCard": {
      return getStateOpenCard(state);
    }

    case "req-takeCard": {
      return getStateCardTaken(state);
    }

    case "req-deleteCard": {
      return getStateDeletedCard(state);
    }

    default:
      return state;
  }
};

const getStateOpenCard = (state: State): State => {
  const { gameField, numberOfPlayer, playerList } = state;
  const playerCoordIndex = playerList[numberOfPlayer].coord;
  const currCell = gameField.values[playerCoordIndex];

  const cellWithOpenCard = openCard(currCell);

  const newGameField: GameField = {
    ...gameField,
    values: { ...gameField.values, [playerCoordIndex]: cellWithOpenCard },
  };

  return {
    ...state,
    gameField: newGameField,
    doEffect: { type: "!takeCard" },
  };
};

const getStateCardTaken = (state: State): State => {
  const { gameField, numberOfPlayer, playerList } = state;
  const player = playerList[numberOfPlayer];

  const cardItems = gameField.values[player.coord].cardItem;

  const newPlayer = {
    ...player,
    inventory: [...player.inventory, ...cardItems],
  };

  const newPlayerList: PlayerListType = {
    ...playerList,
    [numberOfPlayer]: newPlayer,
  };

  return {
    ...state,
    doEffect: { type: "!deleteCard" },
    playerList: newPlayerList,
  };
};

const getStateDeletedCard = (state: State): State => {
  const { gameField, numberOfPlayer, playerList } = state;
  const playerCoordIndex = playerList[numberOfPlayer].coord;
  const currCell = gameField.values[playerCoordIndex];
  const cellWithoutCard = deleteCard(currCell);

  const newGameField: GameField = {
    ...gameField,
    values: {
      ...gameField.values,
      [playerCoordIndex]: cellWithoutCard,
    },
  };

  return {
    ...state,
    gameField: newGameField,
    gameState: {
      type: "gameStarted.getPlayersOrder",
    },
    doEffect: {
      type: "!getNextPlayer",
    },
    dice: 0,
  };
};
