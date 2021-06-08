import { State, PlayerListType, MoveDirection, CellType } from "../../../types";

import { switchToNextPlayer } from "../../../../shared/State";
/**
 * @returns A new state depending on the result of the player's movement.
 */

export const getPlayerMoveResult = (state: State) => {
  const { gameField, playerList, numberOfPlayer, dice } = state;

  const newPlayerCoord = playerList[numberOfPlayer].coord;
  const newCellWithPlayer = gameField.values[newPlayerCoord];
  const isLastStepOfMove = dice === 1;

  const takeFinish = newCellWithPlayer?.name === "finish";


  const takeCard =
    newCellWithPlayer?.name === "commonCell" &&
    newCellWithPlayer.cardItem.length > 0;

  const takeCard =
    newCellWithPlayer?.name === "commonCell" &&
    newCellWithPlayer.cardItem.length > 0;

  const metEnemyCard =
    newCellWithPlayer?.name === "commonCell" && state.enemyList[newPlayerCoord]
      ? true
      : false;

  // TODO: Is flat switch okey? Or i need it nested?!
  switch (true) {
    // TODO: переиспользуемая часть state
    case takeFinish: {
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameResult: "Вы выиграли",
      };
      return newState;
    }

    case takeCard: {
      //Rename ..HealthCard to ...Card
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameState: {
          type: "gameStarted.takeCard",
        },
        doEffect: { type: "!openCard" },
      };
      return newState;
    }

    case metEnemyCard: {
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameState: {
          type: "gameStarted.interactWithEnemy",
        },
        doEffect: { type: "!checkApperanceEnemyCard" },
      };
      return newState;
    }

    case isLastStepOfMove: {
      /*  const changedPartState = switchToNextPlayer(); */
      const newState: State = {
        ...state,
        dice: 0,
        gameState: {
          type: "gameStarted.getPlayersOrder",
        },
        doEffect: {
          type: "!getNextPlayer",
        },
      };
      return newState;
    }

    default: {
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameState: {
          type: "gameStarted.playerMove",
        },
        doEffect: { type: "!checkAvailableNeighboringCell" },
      };
      return newState;
    }
  }
};
