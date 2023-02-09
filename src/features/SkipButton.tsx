import React from "react";
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
  const { enemyList, gameState } = useSelector((state: State) => ({
    ...state,
  }));

  const hasOpenEnemyCard = Object.values(enemyList).some((enemyCard) => {
    return enemyCard.appearance === "open";
  });

  const canSkip =
    gameState.type === "enemyMove.chooseEnemy" ? !hasOpenEnemyCard : false;

  return (
    <SkipButtonContainer
      disabled={!canSkip}
      onClick={() => {
        dispatch({
          type: "clickedSkip",
        });
      }}
    >
      пропустить ход
    </SkipButtonContainer>
  );
};
