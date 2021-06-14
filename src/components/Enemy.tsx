import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { EnemyCardType, State } from "../business/types";

type EnemyArray = {
  list: EnemyCardType[];
};

const EnemyCard = styled.div<EnemyCardType>`
  position: absolute;
  border: 5px solid;
  width: 25px;
  height: 25px;
  margin: 12px;
  box-sizing: border-box;
  color: #c08f5e;
  font-size: 47px;
  text-align: start;
  vertical-align: bottom;
  line-height: 0.15;
  text-transform: unset;
  font-family: sans-serif;
  text-indent: -4px;
  background-color: navy;
  border-color: navy;
  cursor: pointer;

  background-color: ${(props) => {
    if (props.apperance === "closed") {
      return "gray";
    } else {
      return "navy";
    }
  }};

  border-color: ${(props) => {
    if (props.apperance === "closed") {
      return "gray";
    } else {
      return "navy";
    }
  }};
  cursor: ${(props) => {
    if (props.apperance === "closed") {
      return "default";
    } else {
      return "pointer";
    }
  }};
`;

const EnemiesCardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  font-size: 10px;
`;

export const EnemyList = (props: EnemyArray) => {
  const dispatch = useDispatch();
  const state = useSelector((state: State) => ({
    ...state,
  }));
  const { numberOfPlayer, playerList } = state;
  const enemyArray = props.list;
  return (
    <EnemiesCardList>
      {enemyArray.map((enemyCard, index) => (
        <EnemyCard
          key={index}
          {...enemyCard}
          onClick={() => {
            const canFight =
              playerList[numberOfPlayer].coord === enemyCard.coord;
            if (canFight) {
              dispatch({
                type: "req-defeatEnemy",
              });
            } else {
              return null;
            }
          }}
        >
          {enemyCard.apperance === "defeated" ? "x" : null}
        </EnemyCard>
      ))}
    </EnemiesCardList>
  );
};
