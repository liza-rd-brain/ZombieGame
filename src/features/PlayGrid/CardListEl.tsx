import { Health, BoardsCard, WeaponCard, EnemyList } from "../../components";
import {
  CardApperance,
  CellType,
  DeadPlayerListType,
  EnemyListType,
  PlayerListType,
} from "../../business/types";
import { FC, memo, useMemo } from "react";
import { useOpenCardAnimation } from "../../business/effects/useOpenCardAnimation";

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
  //TODO: only for
  return <BoardsCard apperance={apperance} coord={coord} />;
  // return useMemo(() => {
  //   return <BoardsCard apperance={apperance} coord={coord} />;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [apperance]);
};

export const CardListEl = memo(
  ({
    cell,
    hor,
    vert,
    currCoord,
    enemyList,
    deadPlayerList,
    activePlayerNumber,
    playerList,
  }: {
    cell: CellType;
    hor: string;
    vert: string;
    currCoord: string;
    enemyList: EnemyListType;
    deadPlayerList: DeadPlayerListType;
    activePlayerNumber: number;
    playerList: PlayerListType;
  }) => {
    //Should get coordinate or is nedd to run

    const playerCoord = playerList[activePlayerNumber].coord;
    useOpenCardAnimation({ coord: "" });

    const MemoCardView = memo(CardView);

    const cardItemList = cell.cardItem;
    if (cardItemList) {
      return (
        <>
          {cardItemList.map((cardItem) => {
            return (
              <MemoCardView
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
  }
);
