import React from "react";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";

import { Player, PlayerList, Health, Wall } from "../components";
import {
  CellType,
  GameField,
  PlayersList,
  PlayersCardType,
} from "../business/types";
import { FINISH_COORD } from "../business/initialState";
import { State } from "../business/types";

type GridProps = {
  vert: number;
};

const GridItem = styled.div<GridProps>`
  border: 2px solid red;
  margin: 0 auto;
  width: 100%;
  transform: rotate(270deg);
  display: grid;
  grid-column-start: -1;
  //параметризирую по ширине поля
  grid-template-columns: ${(props) => {
    return `repeat(${props.vert} ,30px)`;
  }};

  grid-gap: 0px;
  > * {
    transform: rotate(90deg);
  }
`;

const CellItem = styled.div`
  position: relative;
  border: 1px solid #000;
  box-sizing: content-box;
  width: 30px;
  height: 30px;
  color: lightgrey;
`;

function getCell(cell: CellType) {
  switch (cell.name) {
    case "commonCell": {
      return (
        <>
          {cell.cardItem.healthItem ? (
            <Health
              name={cell.cardItem.healthItem.name}
              type={cell.cardItem.healthItem.type}
              apperance={cell.cardItem.healthItem.apperance}
            />
          ) : null}
        </>
      );
    }
  }
}

const getPlayer = (index: string, playersList: PlayersList) => {
  for (let playerKey in playersList) {
    const playerCard = playersList[playerKey];
    const playerCoord = playerCard.coord;
    if (playerCoord == index) {
      return <Player item={playerCard} />;
    }
  }
};

const getPlayerList = (index: string, playersList: PlayersList) => {
  //отдаем массив карточек здоровья
  let healthArr: PlayersCardType[] = [];
  for (let playerKey in playersList) {
    const playerCard = playersList[playerKey];
    const playerCoord = playerCard.coord;
    if (playerCoord == index) {
      healthArr.push(playersList[playerKey]);
    }
  }
  return <PlayerList list={healthArr} />;
};

//TODO:как типизировать возврат jsx
function getFullPlayGrid(gameField: GameField, playersList: PlayersList) {
  const orderGameCells = gameField.order;

  const fullPlayerGrid = orderGameCells.map((orderIndex: string) => {
    const cellValues = gameField.values[orderIndex];
    const [hor, vert] = orderIndex.split(".");

    // TODO: getCell переименовать в getCards-?!
    switch (cellValues.name) {
      case "wall": {
        return (
          <CellItem key={`${hor}${vert}`}>
            <Wall></Wall>
          </CellItem>
        );
      }
      case "start" || "finish": {
        return (
          <CellItem key={`${hor}${vert}`}>
            {getCell(cellValues)}
            {getPlayerList(orderIndex, playersList)}
            {hor}
            {vert}
          </CellItem>
        );
      }
      default: {
        return (
          <CellItem key={`${hor}${vert}`}>
            {getCell(cellValues)}
            {getPlayerList(orderIndex, playersList)}
            {/*  {getPlayer(orderIndex, playersList)} */}
            {hor}
            {vert}
          </CellItem>
        );
      }
    }
  });

  return fullPlayerGrid;
}

export const PlayGrid = () => {
  const { gameField, playersList } = useSelector((state: State) => ({
    ...state,
  }));
  const { hor: maxHor, vert: maxVert } = FINISH_COORD;
  const height = maxVert + 1;
  const playerGrid = (
    <GridItem vert={height}>{getFullPlayGrid(gameField, playersList)}</GridItem>
  );
  return playerGrid;
};
