import { EnemyCardType, EnemiesListType } from "../../../types";

export const openEnemyCard = (
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
