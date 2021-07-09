import { State } from "../../types";

export const checkCardApperance = (state: State): State => {
  const { enemyList, playerList, activePlayerNumber } = state;
  const currentCoord = playerList[activePlayerNumber].coord;

  const isNeedOpenEnemyCard =
    enemyList[currentCoord].apperance === "open" ? false : true;

  switch (true) {
    case isNeedOpenEnemyCard: {
      return {
        ...state,
        doEffect: { type: "!openEnemyCard" },
      };
    }

    case !isNeedOpenEnemyCard: {
      return {
        ...state,
        gameState: {
          ...state.gameState,
          type: "interactWithEnemy.throwBattleDice",
        },

        dice: 0,
      };
    }

    default: {
      return state;
    }
  }
};
