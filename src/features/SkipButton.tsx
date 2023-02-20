import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";
import { State } from "../business/types";

const SkipButtonContainer = styled.button`
  height: 40px;
  width: 85px;
  cursor: pointer;
`;

export const SkipButton = () => {
  const dispatch = useDispatch();

  const enemyList = useSelector((state: State) => state.enemyList);
  const gameState = useSelector((state: State) => state.gameState);

  const activePlayerDead = useSelector((state: State) => {
    const activePlayerNumber = state.activePlayerNumber;
    const isPlayerDead =
      state.deadPlayerList && state.deadPlayerList[activePlayerNumber];
    return Boolean(isPlayerDead);
  });

  const hasOpenEnemyCard = Object.values(enemyList).some((enemyCard) => {
    return enemyCard.appearance === "open";
  });

  const canSkip =
    gameState.type === "gameStarted.rollDice" && activePlayerDead
      ? !hasOpenEnemyCard
      : false;

  const MemoButton = useMemo(() => SkipButtonContainer, [canSkip]);
  return (
    <MemoButton
      disabled={!canSkip}
      onClick={() => {
        dispatch({
          type: "clickedSkip",
        });
      }}
    >
      пропустить ход
    </MemoButton>
  );
};
