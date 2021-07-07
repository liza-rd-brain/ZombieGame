import { AvailableCellListType, State } from "../../../types";
import { ActionType } from "../../../reducer";

import { getStateCardSelected } from "../../common/getStateCardSelected";
import { getStateGiveCard } from "./getStateGiveCard";
import { getStateHealCurrPlayer } from "./getStateHealCurrPlayer";
import { getStateHealAnotherPlayer } from "./getStateHealAnotherPlayer";
import { getStateHoleFilled } from "./getStateHoleFilled";
import { getNeighboringCellList } from "../../common";
import { canInteractWithCell } from "../../../../components/PlayerList/canInteractWithCell";
/**
 *  In payload get order number of chosen for interact player.
 * If this number = indexCurrPlayer we heal player.
 * If not - we give context menu: need heal or apply.
 */
export const applyCard = (state: State, action: ActionType): State => {
  const { numberOfPlayer, playerList } = state;

  const chosenCardType = playerList[numberOfPlayer].inventory.cardSelected;

  switch (action.type) {
    case "req-shareCard": {
      const recipientPlayerNumber = action.payload;
      return getStateGiveCard(state, recipientPlayerNumber);
    }

    case "cardChoosed": {
      const typeOfSelect = action.payload.type;
      return getStateCardSelected(state, typeOfSelect);
    }

    case "clickedContextMenu": {
      const recipientPlayerNumber = action.payload.card.orderNumber;
      const typeOfAction = action.payload.buttonType;
      switch (typeOfAction) {
        case "heal": {
          const newState = getStateHealAnotherPlayer(
            state,
            recipientPlayerNumber
          );

          const stateClosedContextMenu = {
            ...newState,
            playerList: {
              ...newState.playerList,
              [recipientPlayerNumber]: {
                ...newState.playerList[recipientPlayerNumber],
                showContextMenu: false,
              },
            },
          };
          return stateClosedContextMenu;
        }
        case "share": {
          const newState = getStateGiveCard(state, recipientPlayerNumber);

          const stateClosedContextMenu = {
            ...newState,
            playerList: {
              ...newState.playerList,
              [recipientPlayerNumber]: {
                ...newState.playerList[recipientPlayerNumber],
                showContextMenu: false,
              },
            },
          };
          return stateClosedContextMenu;
        }
        default: {
          return state;
        }
      }
    }

    case "clickedPlayer": {
      const clickedPlayerCard = action.payload;
      const currPlayer = playerList[numberOfPlayer];
      const isCurrentPlayer = clickedPlayerCard.orderNumber === numberOfPlayer;

      const cellsForInteract = getCellsForInteract(state);

      const listForHealing = cellsForInteract.concat(currPlayer.coord);

      const canInteractWithPlayer = listForHealing.includes(
        clickedPlayerCard.coord
      );

      const typeOfChosedCard =
        playerList[numberOfPlayer].inventory.cardSelected;

      switch (canInteractWithPlayer) {
        case true: {
          switch (typeOfChosedCard) {
            case "health": {
              switch (isCurrentPlayer) {
                case true: {
                  return getStateHealCurrPlayer(state);
                }

                case false: {
                  /**
                   * Open context menu at recipient  card
                   */
                  const newState: State = {
                    ...state,
                    playerList: {
                      ...state.playerList,
                      [clickedPlayerCard.orderNumber]: {
                        ...state.playerList[clickedPlayerCard.orderNumber],
                        showContextMenu: true,
                      },
                    },
                  };

                  return newState;
                }
              }
            }
            case "weapon":
            case "boards": {
              /**
               * For preventing sharing any cards with himself
               */
              switch (isCurrentPlayer) {
                case true: {
                  return state;
                }
                case false: {
                  return getStateGiveCard(state, clickedPlayerCard.orderNumber);
                }
              }
            }
            default: {
              return state;
            }
          }
        }
        case false: {
          console.log("не можем взаимодействовать с игроком ");
          return state;
        }
        default: {
          return state;
        }
      }
    }

    default: {
      switch (chosenCardType) {
        case "health": {
          switch (action.type) {
            case "req-healPlayer": {
              /**
               * Need to increase playerHealth
               * Then remove card from inventory
               * Can we do this simultaneously?
               */

              const indexChosenPlayer = action.payload;
              const isCurrPlayer = indexChosenPlayer === numberOfPlayer;

              switch (isCurrPlayer) {
                case true:
                  return getStateHealCurrPlayer(state);

                case false: {
                  return getStateHealAnotherPlayer(state, indexChosenPlayer);
                }
                default:
                  return state;
              }
            }

            default:
              return state;
          }
        }

        case "boards": {
          switch (action.type) {
            case "req-fillHole": {
              const { coord, direction } = action.payload;
              return getStateHoleFilled(state, coord, direction);
            }

            default:
              return state;
          }
        }

        default:
          return state;
      }
    }
  }
};

/**
 * Show coordinates of cells with wich player can interact(apply card)
 */
const getCellsForInteract = (state: State) => {
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
