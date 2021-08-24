import { canInteractWithCell } from "../../../../components/Player/canInteractWithCell";
import { State, PLayerType, AvailableCellListType } from "../../../types";
import { getNeighboringCellList } from "../../common";
import { getStateGiveCard } from "./getStateGiveCard";
import { getStateHealCurrPlayer } from "./getStateHealCurrPlayer";

export const getStateClickedPlayer = (
  state: State,
  clickedPlayerCard: PLayerType
) => {
  const { activePlayerNumber, playerList } = state;

  const currPlayer = playerList[activePlayerNumber];
  const isCurrentPlayer = clickedPlayerCard.orderNumber === activePlayerNumber;
  const cellsForInteract = getCellsForInteract(state);
  const listForHealing = cellsForInteract.concat(currPlayer.coord);
  const canInteractWithPlayer = listForHealing.includes(
    clickedPlayerCard.coord
  );

  const typeOfChosedCard =
    playerList[activePlayerNumber].inventory.cardSelected;

  switch (canInteractWithPlayer) {
    case true: {
      switch (typeOfChosedCard) {
        case "health": {
          switch (isCurrentPlayer) {
            case true: {
              return getStateHealCurrPlayer(state);
            }

            case false: {
              const clickedPlayerCardNumber = clickedPlayerCard.orderNumber;
              return openContextMenu(state, clickedPlayerCardNumber);
            }

            default: {
              return state;
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

            default: {
              return state;
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
};

/**
 * Open context menu at recipient  card
 */
const openContextMenu = (state: State, recipientPlayerNumber: number) => {
  const stateOpenedContextMenu: State = {
    ...state,
    playerList: {
      ...state.playerList,
      [recipientPlayerNumber]: {
        ...state.playerList[recipientPlayerNumber],
        showContextMenu: true,
      },
    },
  };

  return stateOpenedContextMenu;
};

/**
 * Show coordinates of cells with wich player can interact(apply card)
 */
const getCellsForInteract = (state: State) => {
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
    const { coord } = cellItem;
    return coord;
  });

  switch (gameState.type) {
    case "gameStarted.applyCard":
      return availableCellsCoords;

    default:
      return [];
  }
};
