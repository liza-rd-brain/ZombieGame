import { State } from "../../../types";

export const changePlayerCoord = (state: State, newPlayerCoord: string) => {
  const { playerList, activePlayerNumber } = state;

  const newPlayerList = {
    ...playerList,
    [activePlayerNumber]: {
      ...playerList[activePlayerNumber],
      coord: newPlayerCoord,
    },
  };
  return newPlayerList;
};
