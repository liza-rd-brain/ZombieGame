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
  let enemiesArr: EnemyCardType[] = [];
  for (let enemiesKey in enemiesList) {
    const enemiesCard = enemiesList[enemiesKey];
    const enemiesCoord = enemiesCard.coord;
    if (enemiesCoord === index) {
      enemiesArr.push(enemiesList[enemiesKey]);
    }
  }
  if (enemiesArr.length > 0) {
    return (
      <EnemyList
        list={enemiesArr}
        activePlayerNumber={activePlayerNumber}
        deadPlayerList={deadPlayerList}
      />
    );
  } else return null;
};
