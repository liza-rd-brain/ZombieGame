import { EnemyCardType, EnemyListType } from "../../../types";

export const openEnemyCard = (
  enemyList: EnemyListType,
  coord: string
): EnemyListType => {
  const currEnemyCard = enemyList[coord];
  const openedEnemyCard: EnemyCardType = {
    ...currEnemyCard,
    apperance: "open",
  };

  return { ...enemyList, [coord]: openedEnemyCard };
};
