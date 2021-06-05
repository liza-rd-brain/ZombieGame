import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { EnemyCardType, State } from "../business/types";

type EnemyArray = {
  list: EnemyCardType[];
};

const EnemyCard = styled.div<EnemyCardType>`
  position: absolute;
  border: 5px solid;
  width: 15px;
  height: 15px;
  margin: 12px;
  background-color: ${(props) => {
    if (props.apperance === "closed") {
      return "lightgray";
    } else {
      return "navy";
    }
  }};

  border-color: ${(props) => {
    if (props.apperance === "closed") {
      return "lightgray";
    } else {
      return "navy";
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
                type: "req-hitEnemy",
              });
            } else {
              return null;
            }
          }}
        />
      ))}
    </EnemiesCardList>
  );
};
