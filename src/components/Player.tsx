import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import {
  PlayerCardType,
  AvailableCellListType,
  State,
} from "../business/types";
import { getNeighboringCellList } from "../business/phases/gameStarted/getNeighboringCellList";
import { canInteractWithCell } from "../business/phases/gameStarted/canInteractWithCell";
import React from "react";

type PlayerItem = {
  isCurrent: boolean;
  needHighlightning?: boolean;
};

type PlayerListItem = {
  playerList: PlayerCardType[];
  numberOfPlayer: number;
  getContextMenu: Function;
};

type ContextMenuType = {
  visible: boolean;
};

const PlayerCard = styled.div<PlayerItem>`
  background-color: #9f3f3f;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  margin: 2px;
  z-index: 3;
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
  cursor: default;
`;

const PlayerCardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  z-index: 3;
  font-size: 12px;
  font-weight: bold;
  color: white;
`;

export const PlayerList = (props: PlayerListItem) => {
  const dispatch = useDispatch();
  const { list, numberOfPlayer } = props;
  return (
    <PlayerCardList>
      {list.map((item, index) => (
        <PlayerCard
          key={index}
          isCurrent={numberOfPlayer == item.orderNumber}
          onClick={() => {
            dispatch({
              type: "playerChoosed",
              payload: index,
            });
          }}
        >
          {" "}
          {item.orderNumber + 1}
        </PlayerCard>
      ))}
    </PlayerCardList>
  );
};

const getAvailableCellList = (state: State) => {
  const { gameState, playerList, numberOfPlayer } = state;

  const neighboringCellList = getNeighboringCellList(state);
  const availableCellList: AvailableCellListType = neighboringCellList.filter(
    (cellItem) => {
      const { direction, coord } = cellItem;

      return canInteractWithCell(state, coord, direction);
    }
  );

  const currPlayerCoord = playerList[numberOfPlayer].coord;

  const availableCellsCoords = availableCellList
    .map((cellItem) => {
      const { direction, coord } = cellItem;
      return coord;
    })
    .concat(currPlayerCoord);

  switch (gameState.type) {
    case "gameStarted.applyCard.contextMenu":
    case "gameStarted.applyCard":
      return availableCellsCoords;

    default:
      return [];
  }
};
