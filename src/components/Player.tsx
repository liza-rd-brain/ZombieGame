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
  border: 5px solid red;
  background-color: red;
  border-radius: 50%;
  width: 4px;
  height: 4px;
  top: 2px;
  left: 1px;
  z-index: 1;
  opacity: 0.5;
  opacity: ${(props) => {
    if (props.isCurrent) {
      return "1";
    }
  }};
`;

const PlayerCardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  z-index: 1;
  font-size: 10px;
  color: green;
`;

export const PlayerList = (props: PlayerListItem) => {
  const { list, numberOfPlayer } = props;
  return (
    <PlayerCardList>
      {list.map((item, index) => (
        <PlayerCard key={index} isCurrent={numberOfPlayer == item.orderNumber}>
          {" "}
          {item.orderNumber}
        </PlayerCard>
      ))}
    </PlayerCardList>
  );
};
