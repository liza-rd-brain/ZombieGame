import { State, PlayerListType, MoveDirection } from "../../../types";

import { deleteSelectedCard } from "../../common/deleteSelectedCard";

export const getStateHoleFilled = (
  state: State,
  coord: number,
  direction: MoveDirection
) => {
  const { gameField, playerList, activePlayerNumber } = state;
  const indexCurrPlayer = activePlayerNumber;
  const newInventory = deleteSelectedCard(playerList, activePlayerNumber);
  const cellWithChosedHole = gameField.values[coord];

  if (cellWithChosedHole.name === "commonCell") {
    const barriersWithClosedHole = cellWithChosedHole.barrierList?.map(
      (barrier) => {
        if (barrier.direction === direction) {
          return { ...barrier, isOpen: false };
        } else return barrier;
      }
    );

    const newGameField = {
      ...gameField,
      values: {
        ...gameField.values,
        [coord]: {
          ...gameField.values[coord],
          barrierList: barriersWithClosedHole,
        },
      },
    };

    const newPlayerList: PlayerListType = {
      ...playerList,
      [indexCurrPlayer]: {
        ...playerList[indexCurrPlayer],
        inventory: newInventory,
      },
    };

    const newState: State = {
      ...state,
      gameField: newGameField,
      playerList: newPlayerList,
      gameState: { ...state.gameState, type: "gameStarted.playerMove" },
      doEffect: { type: "!checkAvailableNeighboringCell" },
    };

    return newState;
  } else {
    return state;
  }
};
