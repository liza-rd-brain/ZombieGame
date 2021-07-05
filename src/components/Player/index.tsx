import ReactDOM from "react-dom";

import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import {
  PlayerCardType,
  AvailableCellListType,
  State,
  TypeOfCard,
} from "../../business/types";
import { getNeighboringCellList } from "../../business/phases/common/getNeighboringCellList";
import { canInteractWithCell } from "./canInteractWithCell";

import img from "./player.png";
import React from "react";

type PlayerItem = {
  isCurrent: boolean;
  needHighlightning?: boolean;
};

type PlayerCardListType = {
  needSplitCard?: boolean;
};

type PlayerListItem = {
  playerListOnCell: PlayerCardType[];
  getContextMenu: Function;
};

type ContextMenuType = {
  visible: boolean;
};

type PLayersPortalType = {
  coordX: string;
  coordY: string;
};

const PLayersPortal = styled.div<PLayersPortalType>`
  position: relative;
  display: flex;
  left: ${(props) => {
    return `${Number(props.coordX) * 50}px`;
  }};

  bottom: ${(props) => {
    return `${Number(props.coordY) * 50 + 50}px`;
  }};
`;

const PlayerCard = styled.div<PlayerItem>`
  width: 50px;
  height: 50px;
  margin: 0px;
  text-align: center;
  padding: 2px;
  box-sizing: border-box;
  cursor: default;
  background-repeat: no-repeat;
  background-position: 0px;
  background-image: url(${img});
  background-size: 44px;
  background-position: 3px;

  z-index: ${(props) => {
    if (props.isCurrent) {
      return "4";
    } else {
      return "3";
    }
  }};

  &:before {
    content: "";
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 1px;
    border: ${(props) => {
      if (props.isCurrent) {
        return "5px solid #8834b8";
      }
    }};
    pointer-events: none;
    opacity: 0.5;
    padding: 4px;
    left: 4px;
    top: 4px;
  }
  &:after {
    content: "";
    position: absolute;
    width: 36px;
    height: 36px;
    border-radius: 1px;
    border: ${(props) => {
      if (props.needHighlightning) {
        return "3px solid rgb(55 163 0 / 52%);";
      }
    }};
    padding: 4px;
    left: 0px;
    top: 0px;
  }
`;

const PlayerCardList = styled.div<PlayerCardListType>`
  display: flex;
  flex-wrap: nowrap;
  position: absolute;
  z-index: 3;
  font-size: 12px;
  font-weight: bold;

  > * {
    position: ${(props) => {
      if (props.needSplitCard) {
        return "relative !important";
      }
    }};

    margin: ${(props) => {
      if (props.needSplitCard) {
        return "0 -12px";
      }
    }};
  }
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
  const currPlayerCoord = playerList[numberOfPlayer].coord;
  const listForHealing = listForInteract.concat(currPlayerCoord);
  const currPlayer = playerList[numberOfPlayer];
  const typeOfChosedCard = currPlayer.inventory.cardSelected;

  const needSplitCard = playerListOnCell.length > 1;

  /*  const typeOfChosedCard = chosedCard?.name || null; */

  const playerCardList = (
    <PlayerCardList needSplitCard={needSplitCard}>
      {playerListOnCell.map((playerCardItem, index) => {
        const canInteractWithPlayer = listForInteract.includes(
          playerCardItem.coord
        );

        const canHealPlayer = listForHealing.includes(playerCardItem.coord);

        return (
          <PlayerCard
            id={`player${playerCardItem.orderNumber}`}
            key={index}
            isCurrent={numberOfPlayer == playerCardItem.orderNumber}
            needHighlightning={calculateHighlightning(
              canInteractWithPlayer,
              canHealPlayer,
              typeOfChosedCard
            )}
            onClick={() => {
              playerClickedHandler(
                getContextMenu,
                playerCardItem,
                numberOfPlayer,
                canInteractWithPlayer,
                typeOfChosedCard,
                dispatch
              );
            }}
          ></PlayerCard>
        );
      })}
    </PlayerCardList>
  );

  switch (needSplitCard) {
    case false: {
      return playerCardList;
    }
    case true: {
      const fieildElem = document.getElementById("field");
      switch (fieildElem) {
        case null: {
          return playerCardList;
        }

        default: {
          const [hor, vert] = playerListOnCell[0].coord.split(".");
          const portal = ReactDOM.createPortal(
            <PLayersPortal coordX={hor} coordY={vert}>
              {playerCardList}
            </PLayersPortal>,
            fieildElem
          );
          return portal;
        }
      }
    }
  }
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

  const availableCellsCoords = availableCellList.map((cellItem) => {
    const { direction, coord } = cellItem;
    return coord;
  });

  switch (gameState.type) {
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
  canInteractWithPlayer: boolean,
  typeOfChosedCard: TypeOfCard,
  dispatch: Function
) => {
  const isCurrentPlayer = playerCardItem.orderNumber == numberOfPlayer;
  switch (canInteractWithPlayer) {
    case true: {
      switch (typeOfChosedCard) {
        case "health": {
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
        case "weapon":
        case "boards": {
          /**
           * For preventing sharing any cards with himself
           */
          switch (isCurrentPlayer) {
            case true: {
              break;
            }
            case false: {
              dispatch({
                type: "req-shareCard",
                payload: playerCardItem.orderNumber,
              });
              break;
            }
          }
        }
      }
      break;
    }
    case false: {
      console.log("не можем взаимодействовать с игроком игрока");
      break;
    }
    default:
      break;
  }
};

const calculateHighlightning = (
  canInteractWithPlayer: boolean,
  canHealPlayer: boolean,
  typeOfChosedCard: TypeOfCard
) => {
  switch (canHealPlayer) {
    case true: {
      switch (typeOfChosedCard) {
        case "health": {
          return true;
        }

        case "weapon":
        case "boards": {
          switch (canInteractWithPlayer) {
            case true: {
              return true;
            }
            case false: {
              return false;
            }
          }
        }
        default: {
          return false;
        }
      }
    }
    case false: {
      return false;
    }
  }
};
