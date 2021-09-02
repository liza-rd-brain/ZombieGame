import { PROD_CONFIG } from ".";
import { ConfigType } from "../../business/types";
import { CELLS_BARRIERS_LIST } from "./walls";

export const DEV_CONFIG: ConfigType = {
  cellsBarrierList: [] /* CELLS_BARRIERS_LIST */,
  startCoord: { hor: 0, vert: 0 },
  finishCoord: { hor: 5, vert: 5 },
  amountPlayers: 2,
  initialPlayerHealth: 1,
  amountHealthItems: 5,
  amountBoardsItems: 5,
  amountWeaponsItems: 5,
  amountEnemies: 5,
  cardApperance: "open",
  playGridMode: "cssStyle",
};
