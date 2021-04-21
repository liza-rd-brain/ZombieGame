import ReactDOM from "react-dom";
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
  width: 4px;
  height: 4px;
  top: 2px;
  left: 1px;
  z-index: 1;
  /* opacity: 0.5; */
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

  &:before {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: ${(props) => {
      if (props.needHighlightning) {
        return "3px solid #34b834;";
      }
    }};

    opacity: 0.5;
    padding: 4px;

    left: -1px;
    top: -1px;
  }
`;

const PlayerCardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  z-index: 1;
  font-size: 8px;
  font-weight: bold;
  color: black;
`;

export const PlayerList = (props: PlayerListItem) => {
  const dispatch = useDispatch();
  const state = useSelector((state: State) => ({
    ...state,
  }));

  const { playerList, numberOfPlayer, getContextMenu } = props;
  const listForInteract = getAvailableCellList(state);

  return (
    <PlayerCardList>
      {playerList.map((playerCardItem, index) => {
        const needHighlightning = listForInteract.includes(
          playerCardItem.coord
        );

        const isCurrentPlayer = playerCardItem.orderNumber == numberOfPlayer;

        switch (true) {
          case needHighlightning: {
            switch (true) {
              case isCurrentPlayer: {
                return (
                  <PlayerCard
                    key={index}
                    isCurrent={numberOfPlayer == playerCardItem.orderNumber}
                    needHighlightning={true}
                    onClick={() =>
                      dispatch({
                        type: "req-healPlayer",
                        payload: playerCardItem.orderNumber,
                      })
                    }
                  >
                    {playerCardItem.orderNumber + 1}
                  </PlayerCard>
                );
              }

              case !isCurrentPlayer: {
                return (
                  <React.Fragment key={index}>
                    <PlayerCard
                      key={index}
                      isCurrent={numberOfPlayer == playerCardItem.orderNumber}
                      needHighlightning={true}
                      onClick={() => {
                        getContextMenu(playerCardItem.orderNumber);

                        dispatch({
                          type: "req-contextMenu",
                          payload: playerCardItem.orderNumber,
                        });
                      }}
                    >
                      {playerCardItem.orderNumber + 1}
                    </PlayerCard>
                  </React.Fragment>
                );
              }
              default:
                return null;
            }
          }
          case !needHighlightning: {
            return (
              <PlayerCard
                key={index}
                isCurrent={numberOfPlayer == playerCardItem.orderNumber}
                onClick={() => {
                  console.log("не можем вылечить!");
                }}
              >
                {playerCardItem.orderNumber + 1}
              </PlayerCard>
            );
          }
          default:
            return null;
        }
      })}
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
