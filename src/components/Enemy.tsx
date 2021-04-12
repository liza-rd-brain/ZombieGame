import styled from "styled-components";

import { EnemyCardType } from "../business/types";

type EnemiesArray = {
  list: EnemyCardType[];
};

const EnemyCard = styled.div<EnemyCardType>`
  border: 5px solid;

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

  width: 10px;
  height: 10px;

  position: absolute;
  top: 5px;
  left: 5px;
`;

const EnemiesCardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  font-size: 10px;
`;

export const EnemiesList = (props: EnemiesArray) => {
  const enemiesArray = props.list;
  return (
    <EnemiesCardList>
      {enemiesArray.map((item, index) => (
        <EnemyCard key={index} {...item} />
      ))}
    </EnemiesCardList>
  );
};
