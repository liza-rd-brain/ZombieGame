import { ConfigType, PlayerListType } from "../types";

export const getPlayers = (config: ConfigType): PlayerListType => {
  const startCoord = `${config.startCoord.hor}.${config.startCoord.vert}`;
  const playersList = new Array(config.amountPlayers)
    .fill(0)
    .map((player, index) => {
      const playerCard = {
        name: "player",
        health: config.initialPlayerHealth,
        orderNumber: index,
        coord: startCoord,
        //TODO: Added const emptyInventory
        inventory: { boards: 0, weapon: 0, health: 0, cardSelected: null },
      };
      return [index, playerCard];
    });

  const playersObj: PlayerListType = Object.fromEntries(playersList);
  return playersObj;
};
