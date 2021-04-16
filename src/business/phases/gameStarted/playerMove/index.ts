import {
  GameField,
  State,
  GameFieldCells,
  CellType,
  MoveDirection,
} from "../../../types";
import { ActionType } from "../../../reducer";

import { getNextPlayerCoord } from "./getNextPlayerCoord";
import { getNewState } from "./getNewState";
import { checkCanTakeCell } from "./checkCanTakeCell";
import { changePlayerCoord } from "./changePlayerCoord";

export const playerMove = (action: ActionType, state: State): State => {
  // TODO: First, before the switch, checking all direction on opportunities of making move

  switch (action.type) {
    case "req-checkAvailableNeighboringCell": {
      const gameFieldWithMarkedCell = getGameFieldWithMarkedCell(state);
      return { ...state, gameField: gameFieldWithMarkedCell };
    }
    case "arrowPressed": {
      const direction = action.payload;

      const { playerList, numberOfPlayer, gameField } = state;
      const prevPlayerCoord = playerList[numberOfPlayer].coord;
      const nextPlayerCoord = getNextPlayerCoord(prevPlayerCoord, direction);

      const canTakeNextCell =
        gameField.values[nextPlayerCoord].availableForTake;

      switch (canTakeNextCell) {
        case true: {
          const newPlayerList = changePlayerCoord(state, nextPlayerCoord);
          const newState: State = {
            ...state,
            playerList: newPlayerList,
            doEffect: { type: "!cleanMarkedCell" },
          };
          console.log(newState);
          return newState;
        }
        case false: {
          return state;
        }
        default: {
          return state;
        }
      }
    }
    case "req-cleanMarkedCell": {
      const cleanedGameField = cleanGameField(state);
      return { ...state, gameField: cleanedGameField };
      /*  return state; */
    }

    default: {
      return state;
    }
  }
};

/**
 * We need chekout all neighboring cell
 */
const getGameFieldWithMarkedCell = (state: State): GameField => {
  const { playerList, numberOfPlayer, gameField } = state;

  const prevPlayerCoord = playerList[numberOfPlayer].coord;

  const topCellCoord = getNextPlayerCoord(prevPlayerCoord, "top");
  const bottomCellCoord = getNextPlayerCoord(prevPlayerCoord, "bottom");
  const rightCellCoord = getNextPlayerCoord(prevPlayerCoord, "right");
  const leftCellCoord = getNextPlayerCoord(prevPlayerCoord, "left");

  const availableCellCoord: { direction: MoveDirection; coord: string }[] = [
    { direction: "top", coord: topCellCoord },
    { direction: "bottom", coord: bottomCellCoord },
    { direction: "right", coord: rightCellCoord },
    { direction: "left", coord: leftCellCoord },
  ];

  const existanceAvailableCellCoord = availableCellCoord.filter((coordItem) => {
    const { direction, coord } = coordItem;
    return gameField.values[coord];
  });

  const availableCellList = existanceAvailableCellCoord.map((coordItem): [
    string,
    CellType
  ] => {
    const { direction, coord } = coordItem;

    const availableForTake = checkCanTakeCell(state, coord, direction);
    return [
      coord,
      { ...gameField.values[coord], availableForTake: availableForTake },
    ];
  });

  const availableGameCells = Object.fromEntries(availableCellList);

  const gameFieldWithhAvailableCells = {
    ...gameField,
    values: { ...gameField.values, ...availableGameCells },
  };

  console.log("gameFieldWithhAvailableCells", gameFieldWithhAvailableCells);

  return gameFieldWithhAvailableCells;
};

const cleanGameField = (state: State): GameField => {
  const { gameField } = state;
  const cleanedMarkedCellList = Object.entries({ ...gameField }.values).map(
    (gameFieldCells): [string, CellType] => {
      const [index, cell] = gameFieldCells;
      delete cell.availableForTake;
      return [index, cell];
    }
  );
  console.log("cleanedMarkedGameCells", cleanedMarkedCellList);

  const cleanedMarkedGameCells = Object.fromEntries(cleanedMarkedCellList);

  const cleanedMarkedGameField: GameField = {
    ...gameField,
    values: {
      ...cleanedMarkedGameCells,
    },
  };
  return cleanedMarkedGameField;
};
