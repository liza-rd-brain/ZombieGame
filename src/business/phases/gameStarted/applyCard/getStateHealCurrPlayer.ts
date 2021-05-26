import { State, PlayerListType } from "../../../types";

import { deleteSelectedCard } from "./deleteSelectedCard";
import { changeHealth } from "./changeHealth";

export const getStateHealCurrPlayer = (state: State): State => {
  const { playerList, numberOfPlayer } = state;
  const indexCurrPlayer = numberOfPlayer;
  const newHealth = changeHealth(playerList, indexCurrPlayer);
  const newInventory = deleteSelectedCard(playerList, numberOfPlayer);
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
    gameState: { type: "gameStarted.playerMove" },
  };
};
