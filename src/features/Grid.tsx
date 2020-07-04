import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Man from "./Man";
import Health from "./Health";
import Wall from "./Wall";
import { State, HealthItem } from "./../app";

type GridProps = {
  vert: number;
};

const GridItem = styled.div<GridProps>`
  border: 2px solid red;
  margin: 0 auto;
  width: 100%;

  display: grid;
  grid-column-start: -1;
  /*параметризирую по ширине поля*/
  grid-template-columns: ${(props) => {
    return `repeat(${props.vert} ,30px)`;
  }};

  grid-gap: 0px;
`;

const CellItem = styled.div`
  position: relative;
  border: 1px solid #000;
  box-sizing: content-box;
  width: 30px;
  height: 30px;
  color: lightgrey;
`;

function Cell(props: {
  children: string;
  hor: number;
  vert: number;
  key: string;
  manHor: number;
  manVert: number;
  healthList: Array<HealthItem>;
}) {
  const hasMan = props.manHor === props.hor && props.manVert === props.vert;
  const health = props.healthList.find((item, index) => {
    return item.hor === props.hor && item.vert === props.vert;
  });
  const hasHealth = health ? true : false;
  const hasManAndHealth = hasHealth && hasMan;
  switch (true) {
    case hasManAndHealth: {
      if (health != undefined) {
        return (
          <CellItem>
            <Man hor={props.manHor} vert={props.manVert} />
            <Health
              hor={health.hor}
              vert={health.vert}
              type={health.type}
              apperance={health.apperance}
            />
          </CellItem>
        );
      } else return null;
    }
    case !hasManAndHealth: {
      switch (true) {
        case hasMan: {
          return (
            <CellItem>
              <Man hor={props.manHor} vert={props.manVert} />
            </CellItem>
          );
        }
        case hasHealth: {
          if (health != undefined) {
            return (
              <CellItem>
                <Health
                  hor={health.hor}
                  vert={health.vert}
                  type={health.type}
                  apperance={health.apperance}
                />
              </CellItem>
            );
          } else return null;
        }
        default: {
          return <CellItem />;
        }
      }
    }
    default:
      return null;
  }
}

function getArray(
  manHor: number,
  manVert: number,
  width: number,
  height: number,
  healthList: Array<HealthItem>
) {
  return new Array(height)
    .fill(0)
    .map((itemVert, indexVert) =>
      new Array(width).fill({}).map((itemHor, indexHor) => {
        return (
          <Cell
            hor={indexHor}
            vert={indexVert}
            key={`${indexHor}${indexVert}`}
            manHor={manHor}
            manVert={manVert}
            healthList={healthList}
          >
            {`${indexHor}${indexVert}`}
          </Cell>
        );
      })
    )
    .reverse();
}

type cellItem = {
  hor: number;
  vert: number;
  man?: boolean;
  wall?: boolean;
  health?: any;
};
function getFullArray(gameList: Array<any>) {
  return gameList.map((item: any, index: number) => {
    return item.map((item: any, index: number) => {
      const hasMan = /* item && */ item.man ? true : false;
      const hasHealth = item.health ? true : false;
      const hasWall = item.wall ? true : false;

      const hasManAndHealth = hasMan && hasHealth;
      switch (true) {
        case hasManAndHealth: {
          return (
            <CellItem>
              <Man hor={item.hor} vert={item.vert} />
              <Health
                hor={item.hor}
                vert={item.vert}
                type={item.health.type}
                apperance={item.shealth.apperance}
              />
            </CellItem>
          );
        }
        case hasMan: {
          return (
            <CellItem>
              {`${item.hor}${item.vert}`}
              <Man hor={item.hor} vert={item.vert} />
            </CellItem>
          );
        }
        case hasHealth: {
          return (
            <CellItem>
              <Health
                hor={item.hor}
                vert={item.vert}
                type={item.health.type}
                apperance={item.health.apperance}
              />
            </CellItem>
          );
        }
        case hasWall: {
          return (
            <CellItem>
              <Wall hor={item.hor} vert={item.vert}></Wall>
            </CellItem>
          );
        }
        /*  case !hasMan: {
          return (
            <CellItem
              key={`${item.hor}${item.vert}`}
            >{`${item.hor}${item.vert}`}</CellItem>
          );
        } */
        default:
          return (
            <CellItem
              key={`${item.hor}${item.vert}`}
            >{`${item.hor}${item.vert}`}</CellItem>
          );
      }
    });
  });
}

function Grid() {
  const [
    manHor,
    manVert,
    maxHor,
    maxVert,
    healthList,
    gameList,
  ] = useSelector((state: State) => [
    state.manCoord.hor,
    state.manCoord.vert,
    state.endCoord.hor,
    state.endCoord.vert,
    state.healthList,
    state.gameList,
  ]);

  const width = maxHor + 1;
  const height = maxVert + 1;

  console.log(getFullArray(gameList));

  return (
    <GridItem vert={width}>
      {getFullArray(gameList)}
      {/*   {getArray(manHor, manVert, width, height, healthList)} */}
    </GridItem>
  );
}

export default Grid;
