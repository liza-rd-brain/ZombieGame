import ReactDOM from "react-dom";
import React, { useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import {
  TypeOfInventoryCard,
  PlayerListType,
  GameState,
  PLayerType,
  State,
} from "../../business/types";

import player from "./player.png";
import player2 from "./player2.png";
import player3 from "./player3.png";
import player4 from "./player4.png";

type PlayerItem = {
  isCurrent: boolean;
  needHighlightning?: boolean;
  image: string;
};

type PlayerCardListType = {
  needSplitCards?: boolean;
  needReverseCards?: boolean;
};

type PlayerListItem = {
  playerListOnCell: PLayerType[];
  playerList: PlayerListType;
  numberOfPlayer: number;
  /*   gameState: GameState; */
  /*   isPlayerAlone: boolean; */
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
  background-size: 44px;
  background-position: 3px;

  background-image: ${(props) => {
    return `url(${props.image})`;
  }};

  z-index: ${(props) => {
    if (props.isCurrent) {
      return "10";
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

export const Player = (props: PlayerListItem) => {
  const dispatch = useDispatch();

  const gameState = useSelector((state: State) => state.gameState);

  const playerImageList = [player, player2, player3, player4];

  const {
    playerListOnCell,
    playerList,
    numberOfPlayer,

    /*     isPlayerAlone, */
  } = props;

  const needSplitCards = playerListOnCell.length > 1;

  /**
   * If first the index of active card - then it be rendered first.
   */
  const indexOfActiveCard = playerListOnCell.findIndex((playerCard) => {
    return playerCard.orderNumber === numberOfPlayer;
  });

  const needReverseCards = indexOfActiveCard !== 0 && needSplitCards;

  const MemoizedClickHandler = (playerCardItem: any) =>
    useCallback(
      () =>
        dispatch({
          type: "clickedPlayer",
          payload: playerCardItem,
        }),
      []
    );

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
                onClick={() => MemoizedClickHandler(playerCardItem)}
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
      const [hor, vert] = playerListOnCell[0].coord.split(".");
      const portal = ReactDOM.createPortal(
        <PLayersPortal coordX={hor} coordY={vert}>
          {playerCardList}
        </PLayersPortal>,
        fieildElem
      );

      switch (needSplitCards) {
        case false: {
          return playerCardList;
          // switch (isPlayerAlone) {
          //   case true: {
          //     return portal;
          //   }

          //   case false: {
          //     return playerCardList;
          //   }

          //   default: {
          //     return playerCardList;
          //   }
          // }
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
  typeOfChosedCard: TypeOfInventoryCard,
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
