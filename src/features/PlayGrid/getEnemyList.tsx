import { EnemyList } from "../../components";

import {
  EnemyListType,
  EnemyCardType,
  DeadPlayerListType,
} from "../../business/types";

export const getEnemyList = (
  index: string,
  enemiesList: EnemyListType,
  deadPlayerList: DeadPlayerListType,
  activePlayerNumber: number
) => {
  /*   let enemiesArr: EnemyCardType[] = []; */

  /**
   * Need to draw enemy if current coord of cell has the same coord
   */

  const enemiesArr = Object.entries(enemiesList).map(([string, enemyCard]) => {
    if (enemyCard.coord === index) {
      return enemyCard;
    }
  });

  const filteredEnemiesArr = Object.entries(enemiesList).filter(
    ([string, enemyCard]) => enemyCard.coord === index
  );

  if (enemiesArr.length > 0) {
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
