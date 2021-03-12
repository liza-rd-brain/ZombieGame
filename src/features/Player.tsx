import React from "react";

import styled from "styled-components";

import { PlayerItem, CoordItem, PlayerList } from "../business/types";

type PlayerArray = {
  list: PlayerList;
};

const PlayerItem = styled.div`
  border: 5px solid red;
  border-radius: 50%;
  width: 5px;
  height: 5px;
  background-color: red;
  top: 2px;
  left: 1px;
  z-index: 1;
`;

const PlayerList = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  z-index: 1;
  font-size: 10px;
  color: green;
`;

export const Player = (props: PlayerArray) => {
  const playerArray = props.list;
  return (
    <PlayerList>
      {playerArray.map((item, index) => (
        <PlayerItem key={index}>{item.orderNumber}</PlayerItem>
      ))}
    </PlayerList>
  );
};
