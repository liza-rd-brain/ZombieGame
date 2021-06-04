import { CommonCell, CellType } from "../../../types";

export const deleteCard = (currCell: CellType): CellType => {
  /**
   * When we delete card we now for sure that in cell lying only one card
   */
  if (currCell.name === "commonCell") {
    const cellWithoutHealth: CommonCell = {
      ...currCell,
      cardItem: [],
    };
    return cellWithoutHealth;
  } else return currCell;
};
