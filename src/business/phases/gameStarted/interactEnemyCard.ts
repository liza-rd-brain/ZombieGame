import { CommonCell, State, EnemyCardType, EnemiesListType } from "../../types";

import { ActionType } from "../../reducer";

export const interactEnemyCard = (action: ActionType, state: State): State => {
  const enemiesCardList = state.enemiesList;
  const playerList = state.playersList;
  const numberOfPlayer = state.numberOfPlayer;
  const currentCoord = playerList[numberOfPlayer].coord;

  switch (action.type) {
    case "openedEnemyCard": {
      const newEnemiesList = openEnemyCard(enemiesCardList, currentCoord);

      return {
        ...state,
        enemiesList: newEnemiesList,
        /* doEffect: { type: "!changePlayerHealth" }, */
      };
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
