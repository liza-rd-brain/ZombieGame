import { ConfigType } from "../../business/types";
import { CELLS_BARRIERS_LIST } from "./walls";

export const DEV_CONFIG: ConfigType = {
  cellsBarrierList: [],
  // cellsBarrierList: CELLS_BARRIERS_LIST,
  startCoord: { hor: 0, vert: 0 },
  finishCoord: { hor: 5, vert: 5 },
  amountPlayers: 2,
  initialPlayerHealth: 1,
  amountHealthItems: 4,
  amountBoardsItems: 4,
  amountWeaponsItems: 0,
  amountEnemies: 4,
  cardApperance: "open",
  playGridMode: "cssStyle",
};
