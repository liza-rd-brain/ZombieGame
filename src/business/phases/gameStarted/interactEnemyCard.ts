import {
  CommonCell,
  State,
  EnemyCardType,
  EnemiesListType,
} from "../../types";

import { ActionType } from "../../reducer";

export const interactEnemyCard = (action: ActionType, state: State): State => {
  const enemiesCardList = state.enemiesList;
  const playerList = state.playersList;
  const numberOfPlayer = state.numberOfPlayer;
  const currentCoord = playerList[numberOfPlayer].coord;
  /*   const currEnemy = enemiesCardList[currentCoord]; */

  switch (action.type) {
    case "openedEnemyCard": {
      const newEnemiesList = openEnemyCard(enemiesCardList, currentCoord);
      return { ...state, enemiesList: newEnemiesList };
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

/* const changeHealthList = (healthCell: CellType): CellType => {
  if (healthCell.name === "commonCell" && healthCell.cardItem.healthItem) {
    const { healthItem, ...otherCardItem } = healthCell.cardItem;

    const cellWithoutHealth: CommonCell = {
      ...healthCell,
      cardItem: { ...otherCardItem },
    };
    return cellWithoutHealth;
  } else return healthCell;
}; */

/* const changePlayerHealth = (
  healthCell: CellType,
  playerList: PlayersListType,
  numberOfPlayer: number
) => {
  if (healthCell.name === "commonCell" && healthCell.cardItem.healthItem) {
    const sign = healthCell.cardItem.healthItem.type;

    const currHealth = { ...playerList }[numberOfPlayer].health;

    const incHealth = currHealth + 1;
    const decHealth = currHealth - 1;

    const changedPlayerList: PlayersListType = {
      ...playerList,
      [numberOfPlayer]: {
        ...playerList[numberOfPlayer],
        health: sign === "decrement" ? decHealth : incHealth,
      },
    };

    return changedPlayerList;
  } else {
    return playerList;
  }
};
 */
