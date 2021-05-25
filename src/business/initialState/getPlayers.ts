import { PlayerListType } from "../types";

import {
  AMOUNT_PLAYERS,
  INITIAL_PLAYER_HEALTH,
  START_COORD,
} from "../../shared/config";

export const getPlayers = (): PlayerListType => {
  const startCoord = `${START_COORD.hor}.${START_COORD.vert}`;
  const playersList = new Array(AMOUNT_PLAYERS).fill(0).map((player, index) => {
    const playerCard = {
      name: "player",
      health: INITIAL_PLAYER_HEALTH,
      orderNumber: index,
      coord: startCoord,
      inventory: [],
    };
    return [index, playerCard];
  });

  const playersObj: PlayerListType = Object.fromEntries(playersList);
  return playersObj;
};
