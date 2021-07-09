import { State } from "../../../types";

export const getStateGiveCard = (
  state: State,
  recipientPlayerNumber: number
): State => {
  const { playerList, activePlayerNumber } = state;
  const indexCurrPlayer = activePlayerNumber;

  const currentPlayerInventory = playerList[indexCurrPlayer].inventory;
  const recepientPlayerInventory = playerList[recipientPlayerNumber].inventory;

  const sharedCardType = playerList[indexCurrPlayer].inventory.cardSelected;

  if (sharedCardType) {
    const newCurrentPlayerInventory = {
      ...currentPlayerInventory,
      [sharedCardType]: currentPlayerInventory[sharedCardType] - 1,
      cardSelected: null,
    };

    const newRecepientPlayerInventory = {
      ...recepientPlayerInventory,
      [sharedCardType]: recepientPlayerInventory[sharedCardType] + 1,
    };

    const newPlayerList = {
      ...playerList,
      [indexCurrPlayer]: {
        ...playerList[indexCurrPlayer],
        inventory: newCurrentPlayerInventory,
      },
      [recipientPlayerNumber]: {
        ...playerList[recipientPlayerNumber],
        inventory: newRecepientPlayerInventory,
      },
    };

    return {
      ...state,
      playerList: newPlayerList,
      gameState: { ...state.gameState, type: "gameStarted.playerMove" },
      doEffect: { type: "!checkAvailableNeighboringCell" },
    };
  } else {
    return state;
  }
};
