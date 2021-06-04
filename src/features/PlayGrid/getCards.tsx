import { Health, BoardsCard } from "../../components";
import { CellType } from "../../business/types";

export const getCards = (cell: CellType) => {
  const healthCardItem = cell.cardItem.find(
    (cardItem) => cardItem?.name === "health"
  );

  const boardsCardItem = cell.cardItem.find(
    (cardItem) => cardItem?.name === "boards"
  );

  return (
    <>
      {healthCardItem ? <Health apperance={healthCardItem.apperance} /> : null}
      {boardsCardItem ? (
        <BoardsCard apperance={boardsCardItem.apperance} />
      ) : null}
    </>
  );
};
