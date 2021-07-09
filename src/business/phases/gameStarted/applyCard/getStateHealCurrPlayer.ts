import { State, PlayerListType } from "../../../types";

import { deleteSelectedCard } from "../../common/deleteSelectedCard";
import { changeHealth } from "./changeHealth";

export const getStateHealCurrPlayer = (state: State): State => {
  const { playerList, activePlayerNumber } = state;
  const indexCurrPlayer = activePlayerNumber;
  const newHealth = changeHealth(playerList, indexCurrPlayer);
  const newInventory = deleteSelectedCard(playerList, activePlayerNumber);
  const newPlayerList: PlayerListType = {
    ...playerList,
    [indexCurrPlayer]: {
      ...playerList[indexCurrPlayer],
      inventory: newInventory,
      health: newHealth,
    },
  };

  return {
    ...state,
    playerList: newPlayerList,
    gameState: { ...state.gameState, type: "gameStarted.playerMove" },
    doEffect: {
      type: "!checkAvailableNeighboringCell",
    },
  };
};
