import { ConfigType } from "../../business/types";
import { CELLS_BARRIERS_LIST } from "./walls";

export const DEV_CONFIG: ConfigType = {
  // cellsBarrierList: CELLS_BARRIERS_LIST,
  cellsBarrierList: [],
  startCoord: { hor: 0, vert: 0 },
  finishCoord: { hor: 5, vert: 5 },
  amountPlayers: 2,
  initialPlayerHealth: 3,
  amountHealthItems: 0,
  amountBoardsItems: 0,
  amountWeaponsItems: 0,
  amountEnemies: 20,
  cardAppearance: "closed",
  playGridMode: "image",
};
