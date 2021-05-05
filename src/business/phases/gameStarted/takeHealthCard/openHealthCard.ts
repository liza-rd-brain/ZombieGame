import { HealthCell, CellType, HealthCardType } from "../../../types";

export const openHealthCard = (healthCell: CellType): CellType => {
  if (healthCell.name === "commonCell") {
    const cardItemWithOpenHealth = healthCell.cardItem.map((cardItem) => {
      if (cardItem?.name === "health") {
        const healthCard: HealthCardType = {
          ...cardItem,
          apperance: "open",
        };
        return healthCard;
      } else return cardItem;
    });

    const openedItem: HealthCell = {
      ...healthCell,
      cardItem: cardItemWithOpenHealth,
    };

    return openedItem;
  } else {
    return healthCell;
  }
};
