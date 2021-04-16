import { EnemyList } from "../../components";

import { EnemyListType, EnemyCardType } from "../../business/types";

export const getEnemyList = (index: string, enemiesList: EnemyListType) => {
  let enemiesArr: EnemyCardType[] = [];
  for (let enemiesKey in enemiesList) {
    const enemiesCard = enemiesList[enemiesKey];
    const enemiesCoord = enemiesCard.coord;
    if (enemiesCoord === index) {
      enemiesArr.push(enemiesList[enemiesKey]);
    }
  }
  if (enemiesArr.length > 0) {
    return <EnemyList list={enemiesArr} />;
  } else return null;
};
