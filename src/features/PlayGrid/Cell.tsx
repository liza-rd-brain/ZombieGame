import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { ConfigType, PlayGridMode, State } from "../../business/types";

import { PlayerList } from "./PlayerList";

type CellApperance = {
  needHighlightning?: boolean;
  mode: PlayGridMode;
};

const CellItem = styled.div<CellApperance>`
  display: flex;
  position: relative;
  box-sizing: border-box;

  font-size: 14px;
  text-align: right;
  width: 50px;
  height: 50px;
  color: lightgrey;

  border: ${(props) => {
    if (props.mode === "cssStyle") {
      return "1px solid lightgray";
    }
  }};

  background-color: ${(props) => {
    if (props.needHighlightning) {
      return "rgb(55 163 0 / 52%);";
    }
  }};
`;

//принимает только буквально координату
//через селекторы сама решает что рисовать

/**
 * 1. player
 * 2.enemy
 * 3.invenrory
 * 4.split
 * 5.separate window
 * 6.walls (сейчас просто картинка)
 */
export const Cell: React.FC<{ coord: string; mode: PlayGridMode }> = React.memo(
  function _Cell({ coord, mode }) {
    const cellValues = useSelector(
      (state: State) => state.gameField.values[coord]
    );

    // const activePlayerNumber = useSelector(
    //   (state: State) => state.activePlayerNumber
    // );

    // const gameField = useSelector((state: State) => state.gameField);

    // const playerList = useSelector((state: State) => state.playerList);
    const hasPlayerOnCell = useSelector(
      (state: State) =>
        state.playerList[state.activePlayerNumber]?.coord === coord
    );

    // const gameState = useSelector((state: State) => state.gameState);
    const enemyList = useSelector((state: State) => state.enemyList);
    const deadPlayerList = useSelector((state: State) => state.deadPlayerList);

    const [hor, vert] = coord.split(".");

    // const currPlayerCoord = playerList[activePlayerNumber]?.coord as
    //   | string
    //   | undefined;

    const draftCellNumbers = mode === "cssStyle" ? `${hor}.${vert}` : null;

    // console.log(isNeedCreateSeparateWindow);

    // const hasPlayerOnCell = currPlayerCoord && currPlayerCoord === coord;

    // const cellValues = gameField.values[coord];
    const hasCard = cellValues.cardItem && cellValues.cardItem.length > 0;

    const enemyListOnCell = Object.entries(enemyList).filter(
      ([string, enemyCard]) =>
        enemyCard.coord === coord && enemyCard.apperance === "open"
    );

    const hasEnemy = enemyListOnCell.length > 0;
    const hasClosedEnemyItem = Object.entries(enemyList).find(
      ([string, enemyCard]) =>
        enemyCard.coord === coord && enemyCard.apperance === "closed"
    );

    const isPlayerAlone = !hasEnemy && !hasCard && !hasClosedEnemyItem;

    const memoizedPlayerCard = useMemo(() => {
      return <PlayerList coord={coord} />;
      // return getPlayerList(
      //   coord,
      // playerList,
      // activePlayerNumber,
      // gameState,
      //   isPlayerAlone
      // );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasPlayerOnCell]);

    const memoizedCellItem = useMemo(() => {
      console.log(hasPlayerOnCell);
      return (
        <CellItem needHighlightning={false} mode={mode}>
          {draftCellNumbers}
          {memoizedPlayerCard}
        </CellItem>
      );
    }, [hasPlayerOnCell]);

    return memoizedCellItem;
  }
);
