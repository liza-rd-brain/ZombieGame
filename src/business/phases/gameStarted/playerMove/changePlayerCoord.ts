import { State } from "../../../types";

export const changePlayerCoord = (state: State, newPlayerCoord: string) => {
  const { playerList, numberOfPlayer } = state;

  const newPlayerList = {
    ...playerList,
    [numberOfPlayer]: {
      ...playerList[numberOfPlayer],
      coord: newPlayerCoord,
    },
  };
  return newPlayerList;
};
