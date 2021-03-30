import { CommonCell, State, EnemyCardType, EnemiesListType } from "../../types";

import { ActionType } from "../../reducer";

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
          return {
            ...state,
            doEffect: { type: "!needOpenEnemyCard" },
          };
        }

        case !isNeedOpenEnemyCard: {
          return {
            ...state,
            doEffect: { type: "!needThrowBattleDice" },
            dice: 0,
          };
        }

        default: {
          return state;
        }
      }
    }
    case "openedEnemyCard": {
      const newEnemiesList = openEnemyCard(enemiesCardList, currentCoord);

      return {
        ...state,
        enemiesList: newEnemiesList,
        //для отрисовки статуса!
        doEffect: { type: "!needThrowBattleDice" },
        dice: 0,
      };
    }

    /**
     * 1,2 -убежал
     * 3 - потерял 1 ед здоровья
     * 4 - убил врага
     */

    case "diceIsThrown": {
      const dice = action.payload;
      console.log(dice);
      return {
        ...state,
        dice: action.payload,
        doEffect: { type: "!needGetBattleResult" },
      };
    }

    case "getBattleResult": {
      const dice = state.dice;

      switch (dice) {
        case 1:
        case 2: {
          // Полностью передать управление в clickArrow?!
          // dice=1 - убегает на 1
          return {
            ...state,
            dice: 1,
            gameState: {
              ...state,
              type: "gameStarted.clickArrow",
            },
          };
        }
        case 3: {
          console.log("игрок теряет 1 здоровье");

          const newPlayerHealth = playerList[numberOfPlayer].health - 1;
          const isPlayerAlive = newPlayerHealth > 0 ? true : false;

          const newPlayerList = {
            ...playerList,
            [numberOfPlayer]: {
              ...playerList[numberOfPlayer],
              health: playerList[numberOfPlayer].health - 1,
            },
          };

          if (isPlayerAlive) {
            const newState: State = {
              ...state,
              dice: 0,
              gameState: {
                type: "gameStarted.getOrder",
              },
              doEffect: {
                type: "!getNextPlayer",
              },
              playersList: newPlayerList,
            };

            return newState;
          } else {
            console.log(`игрок №${numberOfPlayer} погиб`);
            return {
              ...state,
              gameState: { type: "endGame" },
              gameResult: "Вы проиграли",
              doEffect: null,
            };
          }
        }

        case 4: {
          const newEnemiesList = { ...enemiesCardList };
          delete newEnemiesList[currentCoord];
          return {
            ...state,
            enemiesList: newEnemiesList,
            dice: 0,
            gameState: {
              type: "gameStarted.getOrder",
            },
            doEffect: {
              type: "!getNextPlayer",
            },
          };
        }
        default:
          return state;
      }
    }

    default: {
      return state;
    }
  }
};

const openEnemyCard = (
  enemiesList: EnemiesListType,
  coord: string
): EnemiesListType => {
  const currEnemyCard = enemiesList[coord];
  const openedEnemyCard: EnemyCardType = {
    ...currEnemyCard,
    apperance: "open",
  };

  return { ...enemiesList, [coord]: openedEnemyCard };
};
