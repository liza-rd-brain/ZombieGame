import { State } from "../../types";
import { getNextPlayerNumber } from "../common/getNextPlayerNumber";

/**
 * @returns  new state depending on the result of the enemys's movement.
 */

export const getEnemyMoveResult = (state: State) => {
  const {
    gameField,
    playerList,
    activePlayerNumber,
    dice,
    enemyList,
    deadPlayerList,
  } = state;

  const enemyIndex =
    deadPlayerList && deadPlayerList[activePlayerNumber].index
      ? deadPlayerList[activePlayerNumber].index
      : null;

  const deadPLayerCoord = enemyIndex ? enemyList[enemyIndex].coord : null;

  if (deadPLayerCoord) {
    const newCellWithEnemy = gameField.values[deadPLayerCoord];
    const isLastStepOfMove = dice === 1;

    const indexMetPlayerCard = Object.values(playerList).find((playerItem) => {
      return playerItem.coord === deadPLayerCoord;
    })?.orderNumber;

    const metPlayerCard =
      indexMetPlayerCard || indexMetPlayerCard === 0 ? true : false;

    // TODO: Is flat switch okey? Or i need it nested?!
    switch (true) {
      case metPlayerCard: {
        if (indexMetPlayerCard || indexMetPlayerCard === 0) {
          const newState: State = {
            ...state,
            dice: state.dice - 1,
            gameState: {
              ...state.gameState,
              type: "interactWithEnemy.throwBattleDice",
            },
            activePlayerNumber: indexMetPlayerCard,
            deadPlayerList: { ...deadPlayerList, [activePlayerNumber]: null },
          };
          return newState;
        } else {
          return state;
        }
      }

      case isLastStepOfMove: {
        const newState: State = {
          ...state,
          doEffect: { type: "!switchToNextPlayer" },
        };

        return newState;
      }

      default: {
        const newState: State = {
          ...state,
          dice: state.dice - 1,
          doEffect: { type: "!checkAvailableNeighboringCell" },
        };
        return newState;
      }
    }
  } else {
    return state;
  }
};
