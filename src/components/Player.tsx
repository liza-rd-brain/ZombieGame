import React from "react";

import styled from "styled-components";

import { PlayerCardType } from "../business/types";

type PlayerItem = {
  isCurrent: boolean;
};

type PlayerListItem = {
  list: PlayerCardType[];
  numberOfPlayer: number;
};

const PlayerCard = styled.div<PlayerItem>`
  border: 5px solid #9f3f3f;
  background-color: #9f3f3f;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  margin: 2px;
  z-index: 1;
  border: ${(props) => {
    if (props.isCurrent) {
      return "5px solid red";
    }
  }};
  background-color: ${(props) => {
    if (props.isCurrent) {
      return "red";
    }
  }};
`;

const PlayerCardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  z-index: 1;
  font-size: 12px;
  font-weight: bold;
  color: white;
`;

export const PlayerList = (props: PlayerListItem) => {
  const { list, numberOfPlayer } = props;
  return (
    <PlayerCardList>
      {list.map((item, index) => (
        <PlayerCard key={index} isCurrent={numberOfPlayer == item.orderNumber}>
          {" "}
          {item.orderNumber + 1}
        </PlayerCard>
      ))}
    </PlayerCardList>
  );
};
