import { State } from "../../types";

export const getNextPlayerNumber = (state: State): number => {
  const numberCurrPlayer = state.activePlayerNumber;
  const commonPlayerList = { ...state.playerList, ...state.deadPlayerList };
  const playerList = Object.entries(commonPlayerList);

  const maxPlayerNumber = playerList.length - 1;
  const minPlayerNumber = 0;
  const nextPlayerNumber =
    numberCurrPlayer + 1 > maxPlayerNumber
      ? minPlayerNumber
      : numberCurrPlayer + 1;

  return nextPlayerNumber;
};
