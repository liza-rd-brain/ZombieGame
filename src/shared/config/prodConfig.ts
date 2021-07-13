import { ConfigType } from "../../business/types";
import { COMMON_CONFIG } from "./common";

export const PROD_CONFIG: ConfigType = {
  ...COMMON_CONFIG,
  startCoord: { hor: 0, vert: 0 },
  finishCoord: { hor: 11, vert: 11 },
  amountPlayers: 1,
  initialPlayerHealth: 3,
  amountHealthItems: 30,
  amountBoardsItems: 30,
  amountWeaponsIte: 30,
  amountEnemies: 30,
  cardApperance: "closed",
  playGridMode: "image",
};
