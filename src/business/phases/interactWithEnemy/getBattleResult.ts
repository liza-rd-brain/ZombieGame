import { State } from "../../types";

export const getBattleResult = (state: State): State => {
  const { dice } = state;

  switch (dice) {
    case 1:
    case 2: {
      return getStatePlayerCanFight(state);
    }

    case 3: {
      return getStatePlayetLoseHealth(state);
    }

    case 4: {
      return getStatePlayerRunsAway(state);
    }
    default:
      return state;
  }
};

const getStatePlayerCanFight = (state: State): State => {
  //Player can use weapon or rethrow dice
  return {
    ...state,
    dice: 0,
    gameState: {
      ...state.gameState,
      type: "interactWithEnemy.makeBattleAction",
    },
  };
};

const getStatePlayerRunsAway = (state: State): State => {
  return {
    ...state,
    dice: 0,
    gameState: {
      ...state.gameState,
      type: "gameStarted.rollDice",
    },
  };
};

const getStatePlayetLoseHealth = (state: State): State => {
  const { playerList, activePlayerNumber } = state;
  const newPlayerHealth = playerList[activePlayerNumber].health - 1;
  const isPlayerAlive = newPlayerHealth > 0 ? true : false;

  switch (isPlayerAlive) {
    case true: {
      const newPlayerList = {
        ...playerList,
        [activePlayerNumber]: {
          ...playerList[activePlayerNumber],
          health: playerList[activePlayerNumber].health - 1,
        },
      };

      const newState: State = {
        ...state,
        dice: 0,
        gameState: {
          ...state.gameState,
          type: "interactWithEnemy.throwBattleDice",
        },
        playerList: newPlayerList,
      };

      return newState;
    }

    case false: {
      console.log(`игрок №${activePlayerNumber} погиб`);

      const newPlayerList = {
        ...playerList,
        [activePlayerNumber]: {
          ...playerList[activePlayerNumber],
          health: playerList[activePlayerNumber].health - 1,
          name: "dead",
        },
      };

      const newState: State = {
        ...state,
        dice: 0,
        gameState: { ...state.gameState, type: "gameStarted.getPlayersOrder" },
        playerList: newPlayerList,
        doEffect: { type: "!getNextPlayer" },
      };

      return newState;
      /*     return {
        ...state,
        gameState: { ...state.gameState, type: "endGame" },
        gameResult: "Вы проиграли",
        doEffect: null,
      };
    } */
    }
  }
};
