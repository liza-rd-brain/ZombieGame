import { ConfigType } from "../../business/types";

type partOfConfig = Partial<ConfigType>;

/*  type B = Required<A>; */

/**
 * This function return config for test.
 * If we can`t pass some properties, function set defaults.
 */
export const createConfig = (partOfConfig: partOfConfig): ConfigType => {
  return {
    cellsBarrierList: partOfConfig.cellsBarrierList || [],
    startCoord: partOfConfig.startCoord || { hor: 0, vert: 0 },
    finishCoord: partOfConfig.finishCoord || { hor: 11, vert: 11 },
    amountPlayers: partOfConfig.amountPlayers || 1,
    initialPlayerHealth: partOfConfig.initialPlayerHealth || 3,
    amountHealthItems: partOfConfig.amountHealthItems || 0,
    amountBoardsItems: partOfConfig.amountHealthItems || 0,
    amountWeaponsIte: partOfConfig.amountWeaponsIte || 0,
    amountEnemies: partOfConfig.amountEnemies || 0,
    cardApperance: partOfConfig.cardApperance || "closed",
    playGridMode: partOfConfig.playGridMode || "image",
  };
};
