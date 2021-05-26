import { MoveDirection } from "../../../types";

/**
 * Returns new coordinate of player.
 * @param currentCoord A string of current coordinate.
 * @param direction  A string of direction.
 * @returns A string with new coordinate.
 */

export const getNextPlayerCoord = (
  currentCoord: string,
  direction: MoveDirection
) => {
  
  const [currPlayerHor, currPlayerVert] = currentCoord.split(".");
  const nextPlayerVert = parseInt(currPlayerVert) + 1;
  const nextPlayerHor = parseInt(currPlayerHor) + 1;
  const prevPlayerVert = parseInt(currPlayerVert) - 1;
  const prevPlayerHor = parseInt(currPlayerHor) - 1;

  switch (direction) {
    case "top": {
      return `${currPlayerHor}.${nextPlayerVert}`;
    }

    case "bottom": {
      return `${currPlayerHor}.${prevPlayerVert}`;
    }

    case "left": {
      return `${prevPlayerHor}.${currPlayerVert}`;
    }

    case "right": {
      return `${nextPlayerHor}.${currPlayerVert}`;
    }

    default:
      return `${currPlayerHor}.${currPlayerVert}`;
  }
};
