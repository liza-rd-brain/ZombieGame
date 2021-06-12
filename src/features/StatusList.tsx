import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import styled from "styled-components";

import {
  State,
  GameState,
  TypeEffect,
  PlayerListType,
} from "../business/types";

import { PlayerStatus } from "./PlayerStatus";
import { PlayersStatusList } from "./PlayersStatusList";

const Status = styled.div`
  width: 200px;
  min-height: 18px;
  width: 250px;
  height: 100px;
  border: 1px solid lightgray;
  background-color: #fff2d9;
  text-align: center;
  font-size: 20px;
  color: #5f5757;
  padding-top: 15px;
  box-sizing: border-box;
`;

export const StatusList = () => {
  type statusType = string;
  const initialStatus: statusType = "";
  const [status, updateStatus] = useState(initialStatus);

  const { dice, playerList, gameState, doEffect, gameResult } = useSelector(
    (state: State) => ({
      ...state,
    })
  );

  const newStatus = getTextStatus(gameState, doEffect, dice, gameResult);
  const batlePhrase = "pежим боя";
  useEffect(() => {
    updateStatus(() => {
      if (gameState.type.includes("interactWithEnemy")) {
        if (gameState.type === "interactWithEnemy") {
          return newStatus;
        } else {
          return `${batlePhrase}: ${newStatus}`;
        }
      } else {
        return newStatus;
      }
    });
  }, [gameState.type, doEffect?.type]);
  return (
    <>
      <Status>{status}</Status>
      <PlayerStatus />
      {/*    <PlayersStatusList /> */}
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
    case "gameStarted.takeCard":
      return "открываем карточку";
    case "gameStarted.applyCard":
      return "применить карточку";

    /*   case "interactWithEnemy.applyCard":
      return "применить оружие"; */
    case "interactWithEnemy.throwBattleDice": {
      return "бросить кубик";
    }
    case "interactWithEnemy.applyCard": {
      return "применить оружие";
    }

    case "interactWithEnemy.makeBattleAction":
    case "interactWithEnemy":
      switch (doEffect?.type) {
        case "!openEnemyCard": {
          return "открываем карточку";
        }

        case "!getBattleResult": {
          switch (dice) {
            case 1:
            case 2: {
              return `выпало ${dice}: игрок применяет оружие или бросает кубик `;
            }
            case 3: {
              return `выпало ${dice}: игрок теряет 1 здоровье`;
            }
            case 4: {
              return `выпало ${dice}: игрок спасается бегством `;
            }
            default:
              return "бросить кубик или применить оружие";
          }
        }
        default:
          return "сделать ход";
      }

    /*   case "gameStarted.interactWithEnemy.fightOrKeepBattle":
      return "применить  оружие или бросить кубик"; */

    case "endGame":
      return gameResult;
    default:
      return "";
  }
};
