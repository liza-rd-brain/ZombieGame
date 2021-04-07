import { State, EnemiesListType } from "../../../types";

import { ActionType } from "../../../reducer";
import { openEnemyCard } from "./openEnemyCard";
import { getBattleResult } from "./getBattleResult";

export const interactEnemyCard = (action: ActionType, state: State): State => {
  const enemiesCardList = state.enemiesList;
  const playerList = state.playersList;
  const numberOfPlayer = state.numberOfPlayer;
  const currentCoord = playerList[numberOfPlayer].coord;

  switch (action.type) {
    case "checkApperanCeEnemyCard": {
      const isNeedOpenEnemyCard =
        enemiesCardList[currentCoord].apperance === "open" ? false : true;

      switch (true) {
        case isNeedOpenEnemyCard: {
          return getStateNeedOpenCard(state);
        }

        case !isNeedOpenEnemyCard: {
          return getStateTrowBattleDice(state);
        }

        default: {
          return state;
        }
      }
    }
    // TODO: просто прокинуть state
    case "openedEnemyCard": {
      return getStateOpenCard(state, enemiesCardList, currentCoord);
    }

    case "diceIsThrown": {
      const dice = action.payload;
      return getStateDIceIsThrown(state, dice);
    }

    case "getBattleResult": {
      return getBattleResult(state);
    }
    default: {
      return state;
    }
  }
};

const getStateNeedOpenCard = (state: State): State => {
  return {
    ...state,
    doEffect: { type: "!needOpenEnemyCard" },
  };
};

const getStateTrowBattleDice = (state: State): State => {
  return {
    ...state,
    doEffect: { type: "!needThrowBattleDice" },
    dice: 0,
  };
};

const getStateOpenCard = (
  state: State,
  enemiesCardList: EnemiesListType,
  currentCoord: string
): State => {
  const newEnemiesList = openEnemyCard(enemiesCardList, currentCoord);

  return {
    ...state,
    enemiesList: newEnemiesList,
    //для отрисовки статуса!
    doEffect: { type: "!needThrowBattleDice" },
    dice: 0,
  };
};

const getStateDIceIsThrown = (state: State, dice: number): State => {
  return {
    ...state,
    dice: dice,
    doEffect: { type: "!needGetBattleResult" },
  };
};
