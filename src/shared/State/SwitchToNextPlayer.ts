import { useSelector } from "react-redux";
import { State, GameState, TypeEffect } from "../../business/types";

export const switchToNextPlayer = () => {
  const changedPartOfState: {
    dice: number;
    gameState: GameState;
    doEffect: TypeEffect;
  } = {
    dice: 0,
    gameState: {
      coordOfAvailableCells: null,
      type: "gameStarted.getPlayersOrder",
    },
    doEffect: {
      type: "!getNextPlayer",
    },
  };
  return changedPartOfState;
};
