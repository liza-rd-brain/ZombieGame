import { EnemyList } from "../../components";

import { EnemyListType, EnemyCardType } from "../../business/types";

export const getEnemyList = (
  index: string,
  enemiesList: EnemyListType,
  hor: string,
  vert: string
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
    return <EnemyList list={enemiesArr} key={`${hor}.${vert}.enemy`} />;
  } else return null;
};
