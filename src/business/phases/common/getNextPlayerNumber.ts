import { State } from "../../types";

export const getNextPlayerNumber = (state: State): number => {
  const { playerList, deadPlayerList, activePlayerNumber, gameState } = state;
  const { attackInitiator } = gameState;
  const commonPlayerList = { ...playerList, ...deadPlayerList };
  const playerListObj = Object.entries(commonPlayerList);

  const maxPlayerNumber = playerListObj.length - 1;

  const minPlayerNumber = 0;

  if (attackInitiator || attackInitiator === 0) {
    const nextPlayerNumber =
      attackInitiator + 1 > maxPlayerNumber
        ? minPlayerNumber
        : attackInitiator + 1;

    console.log(nextPlayerNumber);
    return nextPlayerNumber;
  } else {
    const nextPlayerNumber =
      activePlayerNumber + 1 > maxPlayerNumber
        ? minPlayerNumber
        : activePlayerNumber + 1;
    return nextPlayerNumber;
  }
};
