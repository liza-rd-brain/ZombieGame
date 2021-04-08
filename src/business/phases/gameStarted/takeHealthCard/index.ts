import { State, GameField } from "../../../types";

import { ActionType } from "../../../reducer";
import { openHealthCard } from "./openHealthCard";
import { deleteHealthCard } from "./deleteHealthCard";
import { changePlayerHealth } from "./changePlayerHealth";

export const takeHealthCard = (action: ActionType, state: State): State => {
  switch (action.type) {
    case "req-openHealthCard": {
      return getStateOpenCard(state);
    }

    case "req-changePlayerHealth": {
      return getStateChangedHealth(state);
    }

    case "req-deleteHealthCard" : {
      return getStateDeletedCard(state);
    }

    default:
      return state;
  }
};

const getStateOpenCard = (state: State): State => {
  const { gameField, numberOfPlayer, playersList } = state;
  const playerCoordIndex = playersList[numberOfPlayer].coord;
  const healthCell = gameField.values[playerCoordIndex];

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
};

const getStateChangedHealth = (state: State): State => {
  const { gameField, numberOfPlayer, playersList } = state;
  const playerCoordIndex = playersList[numberOfPlayer].coord;
  const healthCell = gameField.values[playerCoordIndex];

  const changedplayersList = changePlayerHealth(
    healthCell,
    playersList,
    numberOfPlayer
  );

  return {
    ...state,
    doEffect: { type: "!deleteHealthCard"},
    playersList: changedplayersList,
  };
};

const getStateDeletedCard = (state: State): State => {
  const { gameField, numberOfPlayer, playersList } = state;
  const playerCoordIndex = playersList[numberOfPlayer].coord;
  const healthCell = gameField.values[playerCoordIndex];

  const isPlayerAlive = playersList[numberOfPlayer].health > 0;
  const cellWithoutHealthCard = deleteHealthCard(healthCell);

  const newGameField: GameField = {
    ...gameField,
    values: {
      ...gameField.values,
      [playerCoordIndex]: cellWithoutHealthCard,
    },
  };

  switch (true) {
    // TODO: заменить на switchToNextPlayer
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
    //TODO :общая часть state?
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
      return state;
  }
};
