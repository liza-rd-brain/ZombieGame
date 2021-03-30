import styled from "styled-components";

import { EnemiesCardType } from "../business/types";

type EnemiesArray = {
  list: EnemiesCardType[];
};

const EnemyCard = styled.div<EnemiesCardType>`
  border: 5px solid;

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
  z-index: 1;
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
