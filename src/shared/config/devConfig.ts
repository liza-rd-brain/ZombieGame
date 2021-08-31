import { PROD_CONFIG } from ".";
import { ConfigType } from "../../business/types";
import { CELLS_BARRIERS_LIST } from "./walls";

export const DEV_CONFIG: ConfigType = {
  cellsBarrierList: CELLS_BARRIERS_LIST,
  startCoord: { hor: 0, vert: 0 },
  finishCoord: { hor: 11, vert: 11 },
  amountPlayers: 4,
  initialPlayerHealth: 1,
  amountHealthItems: 30,
  amountBoardsItems: 30,
  amountWeaponsItems: 30,
  amountEnemies: 30,
  cardApperance: "open",
  playGridMode: "cssStyle",
};
