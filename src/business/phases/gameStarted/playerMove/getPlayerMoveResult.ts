import { State } from "../../../types";
import { getNextPlayerNumber } from "../../common/getNextPlayerNumber";

/**
 * @returns  new state depending on the result of the player's movement.
 */

export const getPlayerMoveResult = (state: State) => {
  const { gameField, playerList, activePlayerNumber, dice } = state;

  const newPlayerCoord = playerList[activePlayerNumber].coord;
  const newCellWithPlayer = gameField.values[newPlayerCoord];
  const isLastStepOfMove = dice === 1;

  const takeFinish = newCellWithPlayer?.name === "finish";

  const takeCard =
    newCellWithPlayer?.name === "commonCell" &&
    newCellWithPlayer.cardItem.length > 0;

  const metEnemyCard =
    newCellWithPlayer?.name === "commonCell" && state.enemyList[newPlayerCoord]
      ? true
      : false;

  // TODO: Is flat switch okey? Or i need it nested?!
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

    case takeCard: {
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameState: { ...state.gameState, type: "gameStarted.takeCard" },
        doEffect: { type: "!checkApperanceInventoryCard" },
      };
      return newState;
    }

    case metEnemyCard: {
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameState: { ...state.gameState, type: "interactWithEnemy" },
        doEffect: { type: "!checkApperanceEnemyCard" },
      };
      return newState;
    }

    case isLastStepOfMove: {
      const newPlayerNumber = getNextPlayerNumber(state);
      const newState: State = {
        ...state,
        dice: 0,
        gameState: { ...state.gameState, type: "gameStarted.rollDice" },
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
