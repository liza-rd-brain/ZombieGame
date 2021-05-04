import { CommonCell, CellType } from "../../../types";

export const deleteHealthCard = (healthCell: CellType): CellType => {
  if (healthCell.name === "commonCell") {
    const cardItemWithoutHealthItem = healthCell.cardItem.filter((cardItem) => {
      return cardItem?.name !== "health";
    });

    const cellWithoutHealth: CommonCell = {
      ...healthCell,
      cardItem: cardItemWithoutHealthItem,
    };
    return cellWithoutHealth;
  } else return healthCell;
};
