import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import {
  PlayerCardType,
  AvailableCellListType,
  State,
  PlayerListType,
} from "../business/types";
import { getNeighboringCellList } from "../business/phases/gameStarted/getNeighboringCellList";
import { canInteractWithCell } from "../business/phases/gameStarted/canInteractWithCell";
import React from "react";

type PlayerItem = {
  isCurrent: boolean;
  needHighlightning?: boolean;
};

type PlayerListItem = {
  playerListOnCell: PlayerCardType[];
  getContextMenu: Function;
};

type ContextMenuType = {
  visible: boolean;
};

const PlayerCard = styled.div<PlayerItem>`
  background-color: #9f3f3f;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  margin: 2px;
  z-index: 3;
  text-align: center;
  padding: 4px;
  box-sizing: border-box;
  cursor: default;

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
  z-index: 3;
  font-size: 12px;
  font-weight: bold;
  color: white;
`;

export const PlayerList = (props: PlayerListItem) => {
  const dispatch = useDispatch();
  const state = useSelector((state: State) => ({
    ...state,
  }));
  const { playerList, numberOfPlayer } = state;

  /**
   *  playerListOnCell -is all player in one cell
   */
  const { playerListOnCell, getContextMenu } = props;

  const listForInteract = getAvailableCellList(state);

  return (
    <PlayerCardList>
      {playerListOnCell.map((playerCardItem, index) => {
        const canInteractWithPlayer = listForInteract.includes(
          playerCardItem.coord
        );

        const isCurrentPlayer = playerCardItem.orderNumber == numberOfPlayer;

        return (
          <PlayerCard
            id={`player${playerCardItem.orderNumber}`}
            key={index}
            isCurrent={numberOfPlayer == playerCardItem.orderNumber}
            needHighlightning={canInteractWithPlayer}
            onClick={() => {
              playerClickedHandler(
                getContextMenu,
                playerCardItem,
                numberOfPlayer,
                playerList,
                canInteractWithPlayer,
                dispatch
              );
            }}
          >
            {playerCardItem.orderNumber + 1}
          </PlayerCard>
        );
      })}
    </PlayerCardList>
  );
};

const getAvailableCellList = (state: State) => {
  const { gameState, playerList, numberOfPlayer, gameField } = state;
  const prevPlayerCoord = playerList[numberOfPlayer].coord;
  const neighboringCellList = getNeighboringCellList(
    prevPlayerCoord,
    gameField
  );
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

const playerClickedHandler = (
  getContextMenu: Function,
  playerCardItem: PlayerCardType,
  numberOfPlayer: number,
  playerList: PlayerListType,
  canInteractWithPlayer: boolean,
  dispatch: Function
) => {
  const currPlayer = playerList[numberOfPlayer];
  const chosedCard = currPlayer.inventory.find(
    (card) => card?.isSelected === true
  );
  const typeOfChosedCard = chosedCard?.name;
  const isCurrentPlayer = playerCardItem.orderNumber == numberOfPlayer;
  switch (typeOfChosedCard) {
    case "health": {
      switch (canInteractWithPlayer) {
        case true: {
          switch (isCurrentPlayer) {
            case true: {
              dispatch({
                type: "req-healPlayer",
                payload: playerCardItem.orderNumber,
              });
              break;
            }

            case false: {
              getContextMenu(playerCardItem.orderNumber);
            }
          }

          break;
        }

        case false: {
          console.log("не можем вылечить игрока");
          break;
        }

        default: {
          break;
        }
      }
      break;
    }
    case "boards": {
      dispatch({
        type: "req-shareCard",
        payload: playerCardItem.orderNumber,
      });
      break;
    }
  }
};
