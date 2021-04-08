import { HealthCell, CellType } from "../../../types";

export const openHealthCard = (healthCell: CellType): CellType => {
  if (healthCell.name === "commonCell" && healthCell.cardItem.healthItem) {
    const openedItem: HealthCell = {
      ...healthCell,
      cardItem: {
        ...healthCell.cardItem,
        healthItem: {
          ...healthCell.cardItem.healthItem,
          apperance: "open",
        },
      },
    };
    return openedItem;
  } else {
    return healthCell;
  }
};
