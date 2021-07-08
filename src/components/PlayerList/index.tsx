import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import {
  PlayerCardType,
  AvailableCellListType,
  State,
  TypeOfCard,
  PlayerListType,
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
  playerList: PlayerListType;
  numberOfPlayer: number;
};

type PortalType = {
  coordX: string;
  coordY: string;
};

const PLayersPortal = styled.div<PortalType>`
  position: relative;
  display: flex;
  left: ${(props) => {
    return `${Number(props.coordX) * 50}px`;
  }};

  bottom: ${(props) => {
    return `${Number(props.coordY) * 50 + 50}px`;
  }};
`;

const ContextMenuPortal = styled.div<PortalType>`
  position: relative;
  display: flex;
  left: ${(props) => {
    return `${Number(props.coordX) * 50 - 100}px`;
  }};

  bottom: ${(props) => {
    return `${Number(props.coordY) * 50}px`;
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

type ContextMenuType = {
  /*   isVisible: boolean; */
  coord?: { x?: number; y?: number };
};

const ContextMenu = styled.div<ContextMenuType>`
  display: block;
  flex-direction: column;
  position: absolute;
  width: 100px;
  height: 100px;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgb(0 0 0 / 50%);
  justify-content: start;
  padding: 21px 0 0 12px;
  box-sizing: border-box;
  left: ${(props) => {
    if (props.coord?.x) {
      return `${props.coord?.x}px`;
    } else {
      return "0px";
    }
  }};
  top: ${(props) => {
    return `${props.coord?.y}px`;
  }};
`;

const Button = styled.button`
  height: 30px;
  width: 70px;
`;

export const PlayerList = (props: PlayerListItem) => {
  const dispatch = useDispatch();
  const state = useSelector((state: State) => ({
    ...state,
  }));

  const { playerListOnCell, playerList, numberOfPlayer } = props;

  const availableCellList = getAvailableCellList(state);
  /*   console.log(availableCellList); */

  const currPlayerCoord = playerList[numberOfPlayer].coord;

  const listForHealing = availableCellList.concat(currPlayerCoord);

  const currPlayer = playerList[numberOfPlayer];

  const typeOfChosedCard = currPlayer.inventory.cardSelected;

  const needSplitCard = playerListOnCell.length > 1;

  /*  const typeOfChosedCard = chosedCard?.name || null; */

  const playerCardList = (
    <PlayerCardList needSplitCard={needSplitCard}>
      {playerListOnCell.map((playerCardItem, index) => {
        const canInteractWithPlayer = availableCellList.includes(
          playerCardItem.coord
        );

        const canHealPlayer = listForHealing.includes(playerCardItem.coord);

        const contextMenu = (
          <ContextMenu
            key="contextMenu"
            /*    isVisible={playerCardItem.showContextMenu || false} */
            id={"contextMenu"}
            className={"contextMenu"}
            /*    coord={contextMenuState.coord} */
          >
            <Button
              onClick={() => {
                dispatch({
                  type: "clickedContextMenu",
                  payload: { card: playerCardItem, buttonType: "share" },
                });
              }}
            >
              передать
            </Button>
            <Button
              onClick={() => {
                dispatch({
                  type: "clickedContextMenu",
                  payload: { card: playerCardItem, buttonType: "heal" },
                });
              }}
            >
              лечить
            </Button>
          </ContextMenu>
        );

        const playerCard = (
          <PlayerCard
            id={`player${playerCardItem.orderNumber}`}
            key={index}
            isCurrent={numberOfPlayer == playerCardItem.orderNumber}
            needHighlightning={calculateHighlightning(
              canInteractWithPlayer,
              canHealPlayer,
              typeOfChosedCard
            )}
            onClick={() =>
              dispatch({ type: "clickedPlayer", payload: playerCardItem })
            }
          ></PlayerCard>
        );

        switch (playerCardItem.showContextMenu) {
          case true: {
            console.log(numberOfPlayer);
            const activePLayerCoord = playerList[numberOfPlayer].coord;
            const currplayerCoord = playerCardItem.coord;

            const contextMenuCoord = getContextMenuCoord(
              activePLayerCoord,
              currplayerCoord
            );
            console.log(contextMenuCoord);

            const [hor, vert] = contextMenuCoord.split(".");

            const fieildElem = document.getElementById("field");
            switch (fieildElem) {
              case null: {
                return playerCard;
              }

              default: {
                const portal = ReactDOM.createPortal(
                  <ContextMenuPortal
                    coordX={String(hor)}
                    coordY={String(vert)}
                    key="portal"
                  >
                    {contextMenu}
                  </ContextMenuPortal>,
                  fieildElem
                );
                return (
                  <React.Fragment key="fragment">
                    {playerCard}
                    {portal}
                  </React.Fragment>
                );
              }
            }
          }

          default: {
            return playerCard;
          }
        }
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

/**
 * Show coordinates of cells with wich player can interact(apply card)
 */

const getAvailableCellList = (state: State) => {
  const { gameState, playerList, activePlayerNumber, gameField } = state;
  const prevPlayerCoord = playerList[activePlayerNumber].coord;
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

const getContextMenuCoord = (
  activePLayerCoord: string,
  currplayerCoord: string
) => {
  const [horActive, vertActive] = activePLayerCoord.split(".");
  const [horCurrent, vertCurrent] = currplayerCoord.split(".");

  const differenceHor = getNewCoordHor(horCurrent, horActive);
  const differenceVert = getNewCoordVert(vertCurrent, vertActive);
  return `${differenceHor}.${differenceVert}`;
};

const getNewCoordHor = (firstNumber: string, secondNUmber: string) => {
  const difference = Number(firstNumber) - Number(secondNUmber);
  if (difference > 0) {
    return Number(secondNUmber);
  } else if (difference < 0) {
    return Number(secondNUmber) + 3;
  } else {
    return Number(secondNUmber);
  }
};

const getNewCoordVert = (firstNumber: string, secondNUmber: string) => {
  const difference = Number(firstNumber) - Number(secondNUmber);
  if (difference > 0) {
    return Number(secondNUmber) + 2;
  } else if (difference < 0) {
    return Number(secondNUmber) + 1;
  } else {
    return Number(secondNUmber) + 1;
  }
};
