import { Health, BoardsCard, WeaponCard } from "../../components";
import { CellType } from "../../business/types";
import styled from "styled-components";

export const getCards = (cell: CellType) => {
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
        <Health apperance={healthCardItem.apperance} className={""} />
      ) : null}
      {boardsCardItem ? (
        <BoardsCard apperance={boardsCardItem.apperance} />
      ) : null}
      {weaponCardItem ? (
        <WeaponCard apperance={weaponCardItem.apperance} />
      ) : null}
    </>
  );
};
