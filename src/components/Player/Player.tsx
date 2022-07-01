import ReactDOM from "react-dom";
import React from "react";

import { useDispatch } from "react-redux";
import styled from "styled-components";

import {
  TypeOfCard,
  PlayerListType,
  GameState,
  PLayerType,
} from "../../business/types";
import { PlayerCard } from "./PlayerCard";

import player from "./player.png";
import player2 from "./player2.png";
import player3 from "./player3.png";
import player4 from "./player4.png";

type PlayerCardListType = {
  needSplitCards?: boolean;
  needReverseCards?: boolean;
};

type PlayerListItem = {
  playerListOnCell: PLayerType[];
  playerList: PlayerListType;
  numberOfPlayer: number;
  gameState: GameState;
  isPlayerAlone: boolean;
};

type PortalType = {
  coordX: string;
  coordY: string;
  isCurrPlayer?: boolean;
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

  pointer-events: ${({ isCurrPlayer }) => {
    return isCurrPlayer ? "initial" : "none";
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

const PlayerCardList = styled.div<PlayerCardListType>`
  display: flex;
  flex-wrap: nowrap;
  position: absolute;
  font-size: 12px;
  font-weight: bold;
  flex-direction: ${(props) => {
    if (props.needReverseCards) {
      return "row-reverse";
    } else {
      return "row";
    }
  }};

  > * {
    position: ${(props) => {
      if (props.needSplitCards) {
        return "relative !important";
      }
    }};

    margin: ${(props) => {
      if (props.needSplitCards) {
        return "0 -12px";
      }
    }};
  }
`;

type ContextMenuType = {
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

  const playerImageList = [player, player2, player3, player4];

  const {
    playerListOnCell,
    playerList,
    numberOfPlayer,
    gameState,
    isPlayerAlone,
  } = props;

  const needSplitCards = playerListOnCell.length > 1;

  /**
   * If first the index of active card - then it be rendered first.
   */
  const indexOfActiveCard = playerListOnCell.findIndex((playerCard) => {
    return playerCard.orderNumber === numberOfPlayer;
  });

  const needReverseCards = indexOfActiveCard !== 0 && needSplitCards;

  const playerCardList = (
    <PlayerCardList
      needSplitCards={needSplitCards}
      needReverseCards={needReverseCards}
    >
      {playerListOnCell.map((playerCardItem, index) => {
        const coordOfAvailableCards = gameState.coordOfAvailableCards;
        const isActivePlayerAlive = playerList[numberOfPlayer] ? true : false;

        switch (isActivePlayerAlive) {
          case false: {
            return (
              <PlayerCard
                id={`player${playerCardItem.orderNumber}`}
                key={index}
                image={playerImageList[playerCardItem.orderNumber]}
                isCurrent={numberOfPlayer === playerCardItem.orderNumber}
                needHighlightning={false}
                onClick={() =>
                  dispatch({
                    type: "clickedPlayer",
                    payload: playerCardItem,
                  })
                }
              ></PlayerCard>
            );
          }
          case true: {
            const activePlayerCoord = playerList[numberOfPlayer].coord;
            const currPlayer = playerList[numberOfPlayer];
            const typeOfChosedCard = currPlayer.inventory.cardSelected;

            const playerCard = (
              <PlayerCard
                id={`player${playerCardItem.orderNumber}`}
                key={index}
                image={playerImageList[playerCardItem.orderNumber]}
                isCurrent={numberOfPlayer === playerCardItem.orderNumber}
                needHighlightning={calculateHighlightning(
                  coordOfAvailableCards,
                  typeOfChosedCard,
                  playerCardItem,
                  activePlayerCoord
                )}
                onClick={() =>
                  dispatch({
                    type: "clickedPlayer",
                    payload: playerCardItem,
                  })
                }
              ></PlayerCard>
            );

            const contextMenu = (
              <ContextMenu
                key="contextMenu"
                id={"contextMenu"}
                className={"contextMenu"}
              >
                <Button
                  onClick={() => {
                    dispatch({
                      type: "clickedContextMenu",
                      payload: {
                        card: playerCardItem,
                        buttonType: "share",
                      },
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

            switch (playerCardItem.showContextMenu) {
              case true: {
                const activePLayerCoord = playerList[numberOfPlayer].coord;
                const currPlayerCoord = playerCardItem.coord;

                const contextMenuCoord = getContextMenuCoord(
                  activePLayerCoord,
                  currPlayerCoord
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
          }

          default: {
            return null;
          }
        }
      })}
    </PlayerCardList>
  );

  const fieildElem = document.getElementById("field");

  switch (fieildElem) {
    case null: {
      return playerCardList;
    }

    default: {
      //TODO: coordinate handling!

      const coordString = playerListOnCell[0].coord;
      const [hor, vert] = coordString.split(".");
      console.log("coordString", playerListOnCell[0].coord);

      const isCurrPlayer = playerList[numberOfPlayer].coord === coordString;

      const portal = ReactDOM.createPortal(
        <PLayersPortal coordX={hor} coordY={vert} isCurrPlayer={isCurrPlayer}>
          {playerCardList}
        </PLayersPortal>,
        fieildElem
      );

      switch (needSplitCards) {
        case false: {
          switch (isPlayerAlone) {
            case true: {
              return portal;
            }

            case false: {
              return playerCardList;
            }

            default: {
              return playerCardList;
            }
          }
        }

        case true: {
          return portal;
        }

        default: {
          return playerCardList;
        }
      }
    }
  }
};

const calculateHighlightning = (
  coordOfAvailableCards: string[] | null,
  typeOfChosedCard: TypeOfCard,
  playerCardItem: PLayerType,
  activePlayerCoord: string
) => {
  const isActivePlayer = activePlayerCoord === playerCardItem.coord;
  switch (coordOfAvailableCards) {
    case null: {
      return false;
    }
    default: {
      const canInteractWithPlayer = coordOfAvailableCards.includes(
        playerCardItem.coord
      );

      switch (canInteractWithPlayer) {
        case true: {
          switch (typeOfChosedCard) {
            case "health": {
              return true;
            }

            case "weapon":
            case "boards": {
              switch (!isActivePlayer) {
                case true: {
                  return true;
                }
                case false: {
                  return false;
                }
                default: {
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
    }
  }
};

const getContextMenuCoord = (
  activePLayerCoord: string,
  currPlayerCoord: string
) => {
  const [horActive, vertActive] = activePLayerCoord.split(".");
  const [horCurrent, vertCurrent] = currPlayerCoord.split(".");

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
