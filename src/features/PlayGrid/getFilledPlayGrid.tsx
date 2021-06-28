import styled from "styled-components";

import { State, PlayGridMode } from "../../business/types";
import { getCards } from "./getCards";
import { getPlayersList } from "./getPlayersList";
import { getEnemyList } from "./getEnemyList";
import { Barrier } from "./Barrier";

import { PLAY_GRID_MODE } from "../../shared/config";

type CellApperance = {
  hasMarker?: boolean;
  isNeedSepareteCards: boolean;
  mode: PlayGridMode;
};

const Wrap = styled.div`
  position: relative;
`;

const CellItem = styled.div<CellApperance>`
  display: flex;
  position: relative;
  box-sizing: border-box;

  font-size: 14px;
  text-align: right;
  width: 50px;
  height: 50px;
  color: lightgrey;

  border: ${(props) => {
    if (props.mode === "cssStyle") {
      return "1px solid lightgray";
    }
  }};

  background-color: ${(props) => {
    if (props.hasMarker) {
      return "rgb(55 163 0 / 77%);";
    }
  }};

  & > :first-child {
    top: ${(props) => {
      if (props.isNeedSepareteCards) {
        return "-5px";
      }
    }};
    left: ${(props) => {
      if (props.isNeedSepareteCards) {
        return "-21px";
      }
    }};
  }
  & > :last-child {
    top: ${(props) => {
      if (props.isNeedSepareteCards) {
        return "10px";
      }
    }};

    left: ${(props) => {
      if (props.isNeedSepareteCards) {
        return "10px";
      }
    }};
  }
`;

export const getFilledPlayGrid = (state: State, getContextMenu: Function) => {
  const { gameField, playerList, numberOfPlayer, gameState, enemyList } = state;
  const orderGameCells = gameField.order;

  const currPlayerCoord = playerList[numberOfPlayer].coord;

  const availableCells = state.availableCellsCoords?.concat(currPlayerCoord);

  const fullPlayerGrid = orderGameCells.map((orderIndex: string) => {
    const cellValues = gameField.values[orderIndex];
    const [hor, vert] = orderIndex.split(".");

    const hasMarker = availableCells?.includes(orderIndex);

    const [playerX, playerY] = currPlayerCoord.split(".");
    const isPhaseCardsSeparate =
      gameState.type.includes("interactWithEnemy") ||
      gameState.type === "gameStarted.takeCard";

    const isNeedSepareteCards =
      isPhaseCardsSeparate && playerX === hor && playerY === vert;

    return (
      <Wrap key={`${hor}.${vert}`}>
        <CellItem
          hasMarker={hasMarker}
          isNeedSepareteCards={isNeedSepareteCards}
          mode={PLAY_GRID_MODE}
        >
          {getCards(cellValues)}
          {getPlayersList(
            orderIndex,
            playerList,
            numberOfPlayer,
            getContextMenu
          )}
          {cellValues.name === "commonCell"
            ? getEnemyList(orderIndex, enemyList)
            : null}
          {PLAY_GRID_MODE === "cssStyle" ? `${hor}.${vert}` : null}
        </CellItem>
        {cellValues.name === "commonCell" ? (
          <Barrier orderIndex={orderIndex}></Barrier>
        ) : null}
      </Wrap>
    );
  });

  return fullPlayerGrid;
};

const isNeedSeparete = () => {};
