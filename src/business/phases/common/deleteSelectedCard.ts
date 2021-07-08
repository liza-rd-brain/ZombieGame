import { InventoryType, PlayerListType } from "../../types";

export const deleteSelectedCard = (
  playerList: PlayerListType,
  activePlayerNumber: number
) => {
  const currInventory = playerList[activePlayerNumber].inventory;

  const removedCardType = playerList[activePlayerNumber].inventory.cardSelected;

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
