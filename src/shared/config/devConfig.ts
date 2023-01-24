import { ConfigType } from "../../business/types";
import { CELLS_BARRIERS_LIST } from "./walls";

export const DEV_CONFIG: ConfigType = {
  // cellsBarrierList: CELLS_BARRIERS_LIST,
  cellsBarrierList: [],
  startCoord: { hor: 0, vert: 0 },
  finishCoord: { hor: 5, vert: 5 },
  amountPlayers: 1,
  initialPlayerHealth: 3,
  amountHealthItems: 0,
  amountBoardsItems: 0,
  amountWeaponsItems: 40,
  amountEnemies: 0,
  cardApperance: "closed",
  playGridMode: "image",
};
