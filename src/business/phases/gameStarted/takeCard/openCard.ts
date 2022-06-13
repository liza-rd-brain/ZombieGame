import { CellType, CardItem } from "../../../types";

export const openCard = (cell: CellType): CellType => {
  if (cell.name === "commonCell") {
    /**
     * When we open card we now for sure that in cell lying only one card
     */
    const cardItemWithOpenCard = cell.cardItem.map((cardItem) => {
      if (cardItem) {
        const openedCard: CardItem = {
          ...cardItem,
          appearance: "open",
        };
        return openedCard;
      } else {
        return null;
      }
    });

    const openedItem: CellType = {
      ...cell,
      cardItem: cardItemWithOpenCard,
    };

    return openedItem;
  } else {
    return cell;
  }
};
