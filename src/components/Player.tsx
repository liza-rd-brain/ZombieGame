import React from "react";

import styled from "styled-components";

import { PlayerCardType } from "../business/types";

type Player = {
  item: PlayerCardType;
};

type PlayerArray = {
  list: PlayerCardType[];
};

const PlayerCard = styled.div`
  border: 5px solid red;
  border-radius: 50%;
  width: 5px;
  height: 5px;
  background-color: red;
  top: 2px;
  left: 1px;
  z-index: 1;
`;

const PlayerCardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  z-index: 1;
  font-size: 10px;
  color: green;
`;

export const Player = (props: Player) => {
  const { name, health, orderNumber, coord } = props.item;
  return (
    <PlayerCardList>
      <PlayerCard key={coord}>{orderNumber}</PlayerCard>
    </PlayerCardList>
  );
};

export const PlayerList = (props: PlayerArray) => {
  const playerArray = props.list;
  return (
    <PlayerCardList>
      {playerArray.map((item, index) => (
        <PlayerCard key={index}>{item.orderNumber}</PlayerCard>
      ))}
    </PlayerCardList>
  );
};
