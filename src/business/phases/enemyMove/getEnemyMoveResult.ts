import { DeadPlayerListType, State } from "../../types";

/**
 * new state depending on the result of the enemys's movement.
 */
export const getEnemyMoveResult = (state: State) => {
  const { playerList, activePlayerNumber, dice, enemyList, deadPlayerList } =
    state;

  const enemyIndex =
    deadPlayerList && deadPlayerList[activePlayerNumber].index
      ? deadPlayerList[activePlayerNumber].index
      : null;

  const deadPLayerCoord = enemyIndex ? enemyList[enemyIndex].coord : null;

  if (deadPLayerCoord) {
    const isLastStepOfMove = dice === 1;

    /**
     * indexMetPlayerCard  can be 0
     */

    const indexMetPlayerCard = Object.values(playerList).find((playerItem) => {
      return playerItem.coord === deadPLayerCoord;
    })?.orderNumber;

    const metPlayerCard =
      indexMetPlayerCard || indexMetPlayerCard === 0 ? true : false;

    // TODO: Is flat switch okey? Or i need it nested?!
    switch (true) {
      case metPlayerCard: {
        if (
          (deadPlayerList && indexMetPlayerCard) ||
          (deadPlayerList && indexMetPlayerCard === 0)
        ) {
          /**
           * DeadPlayerList without index of active card
           */
          const newDeadPlayerList: DeadPlayerListType = Object.fromEntries(
            Object.entries(deadPlayerList).map(
              ([orderIndex, deadPlayerItem]) => {
                const { name, orderNumber } = deadPlayerItem;
                return [orderIndex, { name, orderNumber }];
              }
            )
          );

          const newState: State = {
            ...state,
            dice: state.dice - 1,
            gameState: {
              ...state.gameState,
              attackInitiator: activePlayerNumber,
              type: "interactWithEnemy.throwBattleDice",
            },
            activePlayerNumber: indexMetPlayerCard,
            deadPlayerList: newDeadPlayerList,
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
