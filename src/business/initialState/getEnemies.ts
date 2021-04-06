import { EnemiesListType } from "../types";

import { AMOUNT_ENEMIES } from "./index";

export const getEnemies = (): EnemiesListType => {
  //Добавить сначала рандомный массив с координатами пустых ячеек
  const enemiesList = new Array(AMOUNT_ENEMIES).fill(0).map((enemy, index) => {
    const enemyCard = {
      name: "enemy",
      power: 1,
      coord: "1.1",
      apperance: "closed",
    };
    //ключ=координата
    return [enemyCard.coord, enemyCard];
  });

  const enemiesObj: EnemiesListType = Object.fromEntries(enemiesList);
  return enemiesObj;
};
