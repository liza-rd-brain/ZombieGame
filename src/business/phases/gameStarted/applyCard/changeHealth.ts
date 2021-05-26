import { PlayerListType } from "../../../types";

export const changeHealth = (
  playerList: PlayerListType,
  indexTarget: number
) => {
  return playerList[indexTarget].health + 1;
};
