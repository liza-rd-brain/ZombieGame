import { Health } from "../../components";
import { CellType } from "../../business/types";

export const getCards = (cell: CellType) => {
  switch (cell.name) {
    case "commonCell": {
      const healthCardItem = cell.cardItem.find(
        (cardItem) => cardItem?.name === "health"
      );
      return (
        <>
          {healthCardItem ? (
            <Health apperance={healthCardItem.apperance} />
          ) : null}
        </>
      );
    }
  }
};
