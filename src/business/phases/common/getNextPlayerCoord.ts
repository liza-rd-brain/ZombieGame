import { MoveDirection } from "../../types";

/**
 * Returns new coordinate of player.
 * @param currentCoord A string of current coordinate.
 * @param direction  A string of direction.
 * @returns A string with new coordinate.
 */

export const getNextPlayerCoord = ({ currentCoord, direction, dice = 1 }:
  {
    currentCoord: string,
    direction: MoveDirection
    dice?: number
  }
) => {


  console.log({ direction })

  const [currPlayerHor, currPlayerVert] = currentCoord.split(".");
  const nextPlayerVert = parseInt(currPlayerVert) + dice;
  const nextPlayerHor = parseInt(currPlayerHor) + dice;
  const prevPlayerVert = parseInt(currPlayerVert) - dice;
  const prevPlayerHor = parseInt(currPlayerHor) - dice;

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

/**
 * 
 * Написать функцию, которая будет давать все возможные координаты, 
 * 1 - максимум ячеек, но нельзя возвращаться назад?, хранить путь? 
 * 2- но сбрасывать путь после подобранных карточек?
 * 
 */
export const getNextPlayerCoordAvailable = ({ currentCoord, direction, dice = 1 }:
  {
    currentCoord: string,
    direction: MoveDirection
    dice?: number
  }
) => {


  console.log({ direction })

  const [currPlayerHor, currPlayerVert] = currentCoord.split(".");
  const nextPlayerVert = parseInt(currPlayerVert) + dice;
  const nextPlayerHor = parseInt(currPlayerHor) + dice;
  const prevPlayerVert = parseInt(currPlayerVert) - dice;
  const prevPlayerHor = parseInt(currPlayerHor) - dice;

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
