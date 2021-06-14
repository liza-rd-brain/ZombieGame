import { PlayerListType } from "../../types";

export const deleteSelectedCard = (
  playerList: PlayerListType,
  numberOfPlayer: number
) => {
  const indexCurrPlayer = numberOfPlayer;
  const currInventory = playerList[indexCurrPlayer].inventory;

  const removedCardIndex = playerList[indexCurrPlayer].inventory.findIndex(
    (card) => {
      return card?.isSelected === true;
    }
  );

  const newInventory = currInventory.filter((card, indexOfCard) => {
    return indexOfCard !== removedCardIndex;
  });
  return newInventory;
};
