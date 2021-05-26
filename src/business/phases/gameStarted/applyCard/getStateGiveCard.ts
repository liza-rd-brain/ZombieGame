import { State } from "../../../types";

export const getStateGiveCard = (
  state: State,
  recipientPlayerNumber: number
): State => {
  const { playerList, numberOfPlayer } = state;
  const indexCurrPlayer = numberOfPlayer;

  const currentPlayerInventory = playerList[indexCurrPlayer].inventory;
  const recepientPlayerInventory = playerList[recipientPlayerNumber].inventory;

  const sharedCardIndex = playerList[indexCurrPlayer].inventory.findIndex(
    (card) => {
      return card?.isSelected;
    }
  );

  const sharedCard = [...currentPlayerInventory][sharedCardIndex];
  const sharedCardWithoutHighlightning = { ...sharedCard, isSelected: false };

  const newCurrentPlayerInventory = currentPlayerInventory.filter(
    (card, indexOfCard) => {
      return indexOfCard !== sharedCardIndex;
    }
  );

  const newRecepientPlayerInventory = [
    ...recepientPlayerInventory,
    sharedCardWithoutHighlightning,
  ];

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
};
