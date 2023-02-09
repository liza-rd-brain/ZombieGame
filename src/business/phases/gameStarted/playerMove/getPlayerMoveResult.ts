import { State } from "../../../types";
import { getNextPlayerNumber } from "../../common/getNextPlayerNumber";

/**
 * @returns  new state depending on the result of the player's movement.
 */

export const getPlayerMoveResult = (state: State) => {
  const {
    gameField,
    playerList,
    activePlayerNumber,
    dice,
    enemyList,
    gameState,
  } = state;

  const newPlayerCoord = playerList[activePlayerNumber].coord;
  const newCellWithPlayer = gameField.values[newPlayerCoord];
  const isLastStepOfMove = dice === 1;

  const takeFinish = newCellWithPlayer?.name === "finish";

  const takeCard =
    newCellWithPlayer?.name === "commonCell" &&
    newCellWithPlayer.cardItem &&
    newCellWithPlayer.cardItem?.length > 0;

  const hasCurrCoordEnemy = Object.entries(enemyList).find(
    ([index, enemyCard]) => {
      return enemyCard.coord === newPlayerCoord;
    }
  );

  //TODO: Why should i check commonCell-?!
  const metEnemyCard =
    newCellWithPlayer?.name === "commonCell" && hasCurrCoordEnemy
      ? true
      : false;

  const { attackInitiator, ...newGameState } = gameState;

  // TODO: Is flat switch okey? Or i need it nested?!
  //TODO: add situation, when meet enemy and card on cell!
  switch (true) {
    case takeFinish: {
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameResult: "Вы выиграли",
        doEffect: null,
      };
      return newState;
    }

    case metEnemyCard: {
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameState: {
          ...newGameState,
          type: "interactWithEnemy",
        },
        doEffect: { type: "!checkAppearanceEnemyCard" },
      };
      return newState;
    }

    case takeCard: {
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameState: {
          ...newGameState,
          type: "gameStarted.takeCard",
        },
        doEffect: { type: "!checkAppearanceInventoryCard" },
      };
      return newState;
    }

    case isLastStepOfMove: {
      const newPlayerNumber = getNextPlayerNumber(state);
      const newState: State = {
        ...state,
        dice: 0,
        gameState: {
          ...newGameState,
          type: "gameStarted.rollDice",
        },
        activePlayerNumber: newPlayerNumber,
      };
      return newState;
    }

    default: {
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameState: { ...state.gameState, type: "gameStarted.playerMove" },
        doEffect: { type: "!checkAvailableNeighboringCell" },
      };
      return newState;
    }
  }
};
