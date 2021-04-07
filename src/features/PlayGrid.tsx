import React from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";

import { PlayerList, Health, Wall, EnemiesList } from "../components";
import {
  CellType,
  GameField,
  PlayersListType,
  PlayerCardType,
  EnemiesListType,
  EnemyCardType,
} from "../business/types";
import { FINISH_COORD } from "../shared/config";
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

const getPlayersList = (index: string, playersList: PlayersListType) => {
  let playersArr: PlayerCardType[] = [];
  for (let playerKey in playersList) {
    const playerCard = playersList[playerKey];
    const playerCoord = playerCard.coord;
    if (playerCoord === index) {
      playersArr.push(playersList[playerKey]);
    }
  }
  if (playersArr.length > 0) {
    return <PlayerList list={playersArr} />;
  } else return null;
};

const getEnemiesList = (index: string, enemiesList: EnemiesListType) => {
  let enemiesArr: EnemyCardType[] = [];
  for (let enemiesKey in enemiesList) {
    const enemiesCard = enemiesList[enemiesKey];
    const enemiesCoord = enemiesCard.coord;
    if (enemiesCoord === index) {
      enemiesArr.push(enemiesList[enemiesKey]);
    }
  }
  if (enemiesArr.length > 0) {
    return <EnemiesList list={enemiesArr} />;
  } else return null;
};

//TODO:как типизировать возврат jsx
function getFullPlayGrid(
  gameField: GameField,
  playersList: PlayersListType,
  enemiesList: EnemiesListType
) {
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
            {getPlayersList(orderIndex, playersList)}
            {hor}
            {vert}
          </CellItem>
        );
      }
      default: {
        return (
          <CellItem key={`${hor}${vert}`}>
            {getCell(cellValues)}
            {getPlayersList(orderIndex, playersList)}
            {getEnemiesList(orderIndex, enemiesList)}

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
  const { gameField, playersList, enemiesList } = useSelector(
    (state: State) => ({
      ...state,
    })
  );
  const { vert: maxVert } = FINISH_COORD;
  const height = maxVert + 1;
  const playerGrid = (
    <GridItem vert={height}>
      {getFullPlayGrid(gameField, playersList, enemiesList)}
    </GridItem>
  );
  return playerGrid;
};
