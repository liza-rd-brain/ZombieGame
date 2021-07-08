import { State, PlayerListType } from "../../../types";

import { deleteSelectedCard } from "../../common/deleteSelectedCard";
import { changeHealth } from "./changeHealth";
export const getStateHealAnotherPlayer = (
  state: State,
  indexChosenPlayer: number
): State => {
  const { playerList, activePlayerNumber } = state;
  const indexCurrPlayer = activePlayerNumber;
  const newInventory = deleteSelectedCard(playerList, activePlayerNumber);
  const newHealth = changeHealth(playerList, indexChosenPlayer);

  const newPlayerList: PlayerListType = {
    ...playerList,
    [indexChosenPlayer]: {
      ...playerList[indexChosenPlayer],
      health: newHealth,
    },
    [indexCurrPlayer]: {
      ...playerList[indexCurrPlayer],
      inventory: newInventory,
    },
  };

  return {
    ...state,
    playerList: newPlayerList,
    gameState: { type: "gameStarted.playerMove" },
    doEffect: {
      type: "!checkAvailableNeighboringCell",
    },
  };
};
