import { EnemiesList } from "../../components";

import { EnemiesListType, EnemyCardType } from "../../business/types";

export const getEnemiesList = (index: string, enemiesList: EnemiesListType) => {
  let enemiesArr: EnemyCardType[] = [];
  for (let enemiesKey in enemiesList) {
    const enemiesCard = enemiesList[enemiesKey];
    const enemiesCoord = enemiesCard.coord;
    if (enemiesCoord === index) {
      enemiesArr.push(enemiesList[enemiesKey]);
    }
  }
  if (enemiesArr.length > 0) {
    return <EnemiesList list={enemiesArr} />;
  } else return null;
};
