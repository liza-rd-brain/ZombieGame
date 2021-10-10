import { EnemyList } from "../../components";

import { EnemyListType, DeadPlayerListType } from "../../business/types";

export const getEnemyList = (
  index: string,
  enemiesList: EnemyListType,
  deadPlayerList: DeadPlayerListType,
  activePlayerNumber: number
) => {
  /**
   * Need to draw enemy if current coord of cell has the same coord
   */
  const filteredEnemiesArr = Object.entries(enemiesList).filter(
    ([string, enemyCard]) =>
      enemyCard.coord === index && enemyCard.apperance === "open"
  );

  if (filteredEnemiesArr.length > 0) {
    return (
      <EnemyList
        list={filteredEnemiesArr}
        activePlayerNumber={activePlayerNumber}
        deadPlayerList={deadPlayerList}
        coord={index}
      />
    );
  } else return null;
};
