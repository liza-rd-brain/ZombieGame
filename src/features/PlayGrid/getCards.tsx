import { Health } from "../../components";
import { CellType } from "../../business/types";

export const getCards = (cell: CellType) => {
  switch (cell.name) {
    case "commonCell": {
      return (
        <>
          {cell.cardItem.healthItem ? (
            <Health
             /*  name={cell.cardItem.healthItem.name} */
              apperance={cell.cardItem.healthItem.apperance}
            />
          ) : null}
        </>
      );
    }
  }
};
