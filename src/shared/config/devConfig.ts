import { ConfigType } from "../../business/types";
import { CELLS_BARRIERS_LIST } from "./walls";

export const DEV_CONFIG: ConfigType = {
  cellsBarrierList: CELLS_BARRIERS_LIST,
  startCoord: { hor: 0, vert: 0 },
  finishCoord: { hor: 11, vert: 11 },
  amountPlayers: 4,
  initialPlayerHealth: 3,
  amountHealthItems: 0,
  amountBoardsItems: 0,
  amountWeaponsItems: 0,
  amountEnemies: 0,
  cardApperance: "closed",
  playGridMode: "image",
};
