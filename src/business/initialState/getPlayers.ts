import { ConfigType, PlayerListType } from "../types";

export const getPlayers = (config: ConfigType): PlayerListType => {
  const startCoord = `${config.START_COORD.hor}.${config.START_COORD.vert}`;
  const playersList = new Array(config.AMOUNT_PLAYERS)
    .fill(0)
    .map((player, index) => {
      const playerCard = {
        name: "player",
        health: config.INITIAL_PLAYER_HEALTH,
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
