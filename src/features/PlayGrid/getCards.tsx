import { Health, BoardsCard, WeaponCard } from "../../components";
import { CellType } from "../../business/types";

export const getCards = (cell: CellType, hor: string, vert: string) => {
  const healthCardItem = cell.cardItem.find(
    (cardItem) => cardItem?.name === "health"
  );

  const boardsCardItem = cell.cardItem.find(
    (cardItem) => cardItem?.name === "boards"
  );
  const weaponCardItem = cell.cardItem.find(
    (cardItem) => cardItem?.name === "weapon"
  );

  return (
    <>
      {healthCardItem ? (
        <Health
          apperance={healthCardItem.apperance}
          className={""}
          key={`${hor}.${vert}.health`}
        />
      ) : null}
      {boardsCardItem ? (
        <BoardsCard
          apperance={boardsCardItem.apperance}
          key={`${hor}.${vert}.boards`}
        />
      ) : null}
      {weaponCardItem ? (
        <WeaponCard
          apperance={weaponCardItem.apperance}
          key={`${hor}.${vert}.weapon`}
        />
      ) : null}
    </>
  );
};
