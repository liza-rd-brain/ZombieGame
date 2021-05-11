import { State, GameField, PlayerListType, CommonCell } from "../../../types";

import { ActionType } from "../../../reducer";
import { openCard } from "./openCard";
import { deleteCard } from "./deleteCard";


export const takeHealthCard = (action: ActionType, state: State): State => {
  switch (action.type) {
    case "req-openHealthCard": {
      return getStateOpenCard(state);
    }

    case "req-takeHealthCard": {
      return getStateCardTaken(state);
    }

    case "req-deleteHealthCard": {
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
    doEffect: { type: "!takeHealthCard" },
  };
};

const getStateCardTaken = (state: State): State => {
  const { gameField, numberOfPlayer, playerList } = state;
  const player = playerList[numberOfPlayer];

  // We know for sure,that on cell lying only healthCard.
  // TODO: potential problem. Need validate of healthCard?.
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
    doEffect: { type: "!deleteHealthCard" },
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
      type: "gameStarted.getOrder",
    },
    doEffect: {
      type: "!getNextPlayer",
    },
    dice: 0,
  };
};
