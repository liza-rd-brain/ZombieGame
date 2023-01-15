import { Health, BoardsCard, WeaponCard, EnemyList } from "../../components";
import {
  CardApperance,
  CellType,
  DeadPlayerListType,
  EnemyListType,
  PlayerListType,
} from "../../business/types";
import { FC, useMemo } from "react";

/**
 * Return inventory and other closed cards
 */

const CardView = ({
  type,
  coord,
  apperance,
}: {
  apperance: CardApperance;
  type: string;
  coord: string;
}) => {
  return useMemo(() => {
    return <BoardsCard apperance={apperance} coord={coord} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apperance]);
};

export const CardListEl: FC<{
  cell: CellType;
  hor: string;
  vert: string;
  currCoord: string;
  enemyList: EnemyListType;
  deadPlayerList: DeadPlayerListType;
  activePlayerNumber: number;
  playerList: PlayerListType;
}> = ({
  cell,
  hor,
  vert,
  currCoord,
  enemyList,
  deadPlayerList,
  activePlayerNumber,
  playerList,
}) => {
  const cardItemList = cell.cardItem;
  if (cardItemList) {
    return (
      <>
        {cardItemList.map((cardItem) => {
          return (
            <CardView
              key={`${hor}.${vert}.health`}
              apperance={cardItem.apperance}
              type={cardItem.name}
              coord={currCoord}
            />
          );
        })}
      </>
    );
  } else {
    return null;
  }
};
