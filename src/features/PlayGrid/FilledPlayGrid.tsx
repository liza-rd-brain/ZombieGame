import React, { useMemo } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { State, PlayGridMode } from "../../business/types";

import { CardListEl } from "./CardListEl";

import { Barrier } from "./Barrier";

import { checkNeedSplitCards } from "./checkNeedSplitCards";
import { getSplittedCardsPassive } from "./getSplittedCardsPassive";

import { useOpenCardAnimation } from "../../business/effects/useOpenCardAnimation";
import { Cell } from "./Cell";

type CellApperance = {
  needHighlightning?: boolean;
  mode: PlayGridMode;
};

type UnderlayerType = {
  coordX: string;
  coordY: string;
};

type CardsListType = "all" | "enemy" | "inventory";
type PlanType = "back" | "front";

const Wrap = styled.div`
  position: relative;
`;

//не получится мемозировать из-за объектов селектора?! н-р gameField - object!?
export const FilledPlayGrid: React.FC = React.memo(function _FilledPlayGrid() {
  const gameField = useSelector((state: State) => state.gameField);
  const _config = useSelector((state: State) => state._config);
  const memoConfig = useMemo(() => _config, []);

  const orderGameCells = gameField.order;

  const fullPlayerGrid = orderGameCells.map((orderIndex: string) => {
    const [hor, vert] = orderIndex.split(".");
    return (
      <Wrap key={`${hor}.${vert}`}>
        <Cell coord={orderIndex} mode={memoConfig.playGridMode} />
      </Wrap>
    );
  });

  return <>{fullPlayerGrid}</>;
});
