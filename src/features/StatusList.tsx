import { useSelector } from "react-redux";

import styled from "styled-components";

import {
  State,
  GameState,
  TypeEffect,
  PlayerListType,
} from "../business/types";

const Status = styled.div`
  border: 1px dotted red;
  color: red;
  width: 200px;
  min-height: 18px;
`;

export const StatusList = () => {
  const { dice, playerList, gameState, doEffect, gameResult } = useSelector(
    (state: State) => ({
      ...state,
    })
  );
  return (
    <>
      <Status>{getTextStatus(gameState, doEffect, dice, gameResult)}</Status>
      <Status>{`здоровье: ${getPlayersHealthList(playerList)}`}</Status>
      <Status>{`координаты: ${getPlayersCoordList(playerList)}`}</Status>
    </>
  );
};

const getTextStatus = (
  gameState: GameState,
  doEffect: TypeEffect,
  dice: number,
  gameResult: string
) => {
  switch (gameState.type) {
    case "gameStarted.trownDice":
      return "бросить кубик";
    case "gameStarted.playerMove":
      return "сделать ход";
    case "gameStarted.takeHealthCard":
      return "открываем карточку";
    case "gameStarted.interactEnemyCard":
      switch (doEffect?.type) {
        case "!openEnemyCard": {
          return "открываем карточку";
        }
        case "!throwBattleDice": {
          return "pежим боя: бросить кубик";
        }
        case "!getBattleResult": {
          switch (dice) {
            case 1:
            case 2: {
              return `выпало ${dice}: игрок спасается бегством `;
            }
            case 3: {
              return `выпало ${dice}: игрок теряет 1 здоровье`;
            }
            case 4: {
              return `выпало ${dice}: враг побежден`;
            }
            default:
              return " ";
          }
        }
        default:
          return " ";
      }

    case "endGame":
      return gameResult;
    default:
      return " ";
  }
};

const getPlayersHealthList = (playersList: PlayerListType) => {
  const playerArray = Object.entries(playersList);
  const healthArray = playerArray.map((player) => {
    const [, playerValue] = player;
    return playerValue.health;
  });

  return healthArray.toString();
};

const getPlayersCoordList = (playersList: PlayerListType) => {
  const playerArray = Object.entries(playersList);
  const coordArray = playerArray.map((player) => {
    const [, playerValue] = player;
    return playerValue.coord;
  });

  return coordArray.toString();
};
