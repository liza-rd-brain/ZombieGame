import { ConfigType } from "../../business/types";

import { CELLS_BARRIERS_LIST } from "./walls";

export const PROD_CONFIG: ConfigType = {
  cellsBarrierList: CELLS_BARRIERS_LIST,
  startCoord: { hor: 0, vert: 0 },
  finishCoord: { hor: 11, vert: 11 },
  amountPlayers: 1,
  initialPlayerHealth: 3,
  amountHealthItems: 30,
  amountBoardsItems: 30,
  amountWeaponsItems: 30,
  amountEnemies: 30,
  cardApperance: "closed",
  playGridMode: "image",
};
