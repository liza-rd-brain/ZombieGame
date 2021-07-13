import { ConfigType } from "../../business/types";
import { COMMON_CONFIG } from "./common";

export const DEV_CONFIG: ConfigType = {
  ...COMMON_CONFIG,
  startCoord: { hor: 0, vert: 0 },
  finishCoord: { hor: 11, vert: 11 },
  amountPlayers: 2,
  initialPlayerHealth: 3,
  amountHealthItems: 0,
  amountBoardsItems: 0,
  amountWeaponsIte: 30,
  amountEnemies: 0,
  cardApperance: "open",
  playGridMode: "cssStyle",
};

type A = Partial<ConfigType>;

type B = Required<A>;
