import { CommonCell, CellType } from "../../../types";

export const deleteHealthCard = (healthCell: CellType): CellType => {
  if (healthCell.name === "commonCell" && healthCell.cardItem.healthItem) {
    const { healthItem, ...otherCardItem } = healthCell.cardItem;

    const cellWithoutHealth: CommonCell = {
      ...healthCell,
      cardItem: otherCardItem,
    };
    return cellWithoutHealth;
  } else return healthCell;
};
