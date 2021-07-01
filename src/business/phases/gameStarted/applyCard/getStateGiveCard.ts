import { State } from "../../../types";

export const getStateGiveCard = (
  state: State,
  recipientPlayerNumber: number
): State => {
  const { playerList, numberOfPlayer } = state;
  const indexCurrPlayer = numberOfPlayer;

  const currentPlayerInventory = playerList[indexCurrPlayer].inventory;
  const recepientPlayerInventory = playerList[recipientPlayerNumber].inventory;

  const sharedCardType = playerList[indexCurrPlayer].inventory.cardSelected;

  if (sharedCardType) {
    const newCurrentPlayerInventory = {
      ...currentPlayerInventory,
      [sharedCardType]: currentPlayerInventory[sharedCardType] - 1,
    };

    const newRecepientPlayerInventory = {
      ...recepientPlayerInventory,
      [sharedCardType]: recepientPlayerInventory[sharedCardType] - 1,
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
      gameState: { type: "gameStarted.playerMove" },
    };
  } else {
    return state;
  }
};
