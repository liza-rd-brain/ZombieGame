import { InventoryType, PlayerListType } from "../../types";

export const deleteSelectedCard = (
  playerList: PlayerListType,
  numberOfPlayer: number
) => {
  const indexCurrPlayer = numberOfPlayer;
  const currInventory = playerList[indexCurrPlayer].inventory;

  const removedCardType = playerList[indexCurrPlayer].inventory.cardSelected;

  if (removedCardType) {
    const newInventory: InventoryType = {
      ...currInventory,
      [removedCardType]: currInventory[removedCardType] - 1,
      cardSelected: null,
    };

    return newInventory;
  } else {
    return currInventory;
  }
};
