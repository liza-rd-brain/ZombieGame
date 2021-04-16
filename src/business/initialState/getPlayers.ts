import { PlayerListType } from "../types";

import { AMOUNT_PLAYERS, INITIAL_PLAYER_HEALTH } from "./../../shared/config";

export const getPlayers = (): PlayerListType => {
  const playersList = new Array(AMOUNT_PLAYERS).fill(0).map((player, index) => {
    const playerCard = {
      name: "player",
      health: INITIAL_PLAYER_HEALTH,
      orderNumber: index,
      coord: "0.0",
    };
    return [index, playerCard];
  });

  const playersObj: PlayerListType = Object.fromEntries(playersList);
  return playersObj;
};
