import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { EnemyCardType, State } from "../../business/types";
import { StyledCommonCard } from "../CommonCard/CommonCard";

import zombie from "./zombie.png";
import zombie_defeated from "./zombie_defeated.png";

type EnemyArray = {
  list: EnemyCardType[];
};

const EnemyCard = styled.div<EnemyCardType>`
  ${StyledCommonCard}

  font-size: 47px;
  text-align: start;
  vertical-align: bottom;
  line-height: 0.15;
  text-transform: unset;
  font-family: sans-serif;
  text-indent: -4px;
  cursor: pointer;
  background-color: ${(props) => {
    if (props.apperance === "open" || props.apperance === "defeated") {
      return "unset";
    }
  }};

  cursor: ${(props) => {
    if (props.apperance === "closed") {
      return "default";
    } else {
      return "pointer";
    }
  }};

  background-image: ${(props) => {
    switch (props.apperance) {
      case "defeated": {
        return `url(${zombie_defeated})`;
      }
      case "open": {
        return `url(${zombie})`;
      }
    }
  }};
`;

const EnemiesCardList = styled.div`
  display: flex;
  position: absolute;
`;

export const EnemyList = (props: EnemyArray) => {
  const dispatch = useDispatch();
  const state = useSelector((state: State) => ({
    ...state,
  }));
  const { activePlayerNumber, playerList } = state;
  const enemyArray = props.list;

  return (
    <EnemiesCardList>
      {enemyArray.map((enemyCard, index) => {
        return (
          <EnemyCard
            key={index}
            {...enemyCard}
            onClick={() => {
              const canFight =
                playerList[activePlayerNumber].coord === enemyCard.coord;
              if (canFight) {
                dispatch({
                  type: "req-defeatEnemy",
                });
              } else {
                return null;
              }
            }}
          >
            {/*  {enemyCard.apperance === "defeated" ? "x" : null} */}
          </EnemyCard>
        );
      })}
    </EnemiesCardList>
  );
};
