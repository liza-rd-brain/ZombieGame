import { EnemyListType, State } from "../../types";
import { getNextPlayerNumber } from "../common/getNextPlayerNumber";

export const removeEnemyCard = (state: State): State => {
  const { enemyList, activePlayerNumber, playerList, gameState, gameField } =
    state;

  const currentCoord = playerList[activePlayerNumber].coord;

  const newEnemyArray = Object.entries(enemyList).filter((enemyItem) => {
    const [, enemyCard] = enemyItem;
    return enemyCard.coord !== currentCoord;
  });
  const newEnemyList: EnemyListType = Object.fromEntries(newEnemyArray);

  const newPlayerNumber = getNextPlayerNumber(state);

  const { attackInitiator, ...newGameState } = gameState;

  const cellHasCard = Boolean(gameField.values[currentCoord].cardItem?.length);

  switch (cellHasCard) {
    case true: {
      return {
        ...state,
        enemyList: newEnemyList,
        dice: 0,
        gameState: {
          ...newGameState,
          type: "gameStarted.takeCard",
        },
        doEffect: { type: "!checkAppearanceInventoryCard" },
      };
    }

    case false: {
      return {
        ...state,
        enemyList: newEnemyList,
        dice: 0,
        gameState: {
          ...newGameState,
          type: "gameStarted.rollDice",
        },
        activePlayerNumber: newPlayerNumber,
      };
    }
  }
};
