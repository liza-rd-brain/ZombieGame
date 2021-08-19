import { useDispatch } from "react-redux";
import styled from "styled-components";

import { DeadPlayerListType, EnemyCardType } from "../../business/types";
import { StyledCommonCard } from "../CommonCard/CommonCard";

import zombie from "./zombie.png";
import zombie_defeated from "./zombie_defeated.png";

type EnemyArray = {
  list: [string, EnemyCardType][];
  activePlayerNumber: number;
  deadPlayerList: DeadPlayerListType;
  coord: string;
};

type EnemyCardApperanceType = EnemyCardType & {
  isCurrent: boolean;
};

const EnemyCard = styled.div<EnemyCardApperanceType>`
  ${StyledCommonCard}

  font-size: 47px;
  text-align: start;
  vertical-align: bottom;
  line-height: 0.15;
  text-transform: unset;
  font-family: sans-serif;
  text-indent: -4px;
  cursor: pointer;
  background-color: ${(props) => {
    if (props.apperance === "open" || props.apperance === "defeated") {
      return "unset";
    }
  }};

  cursor: ${(props) => {
    if (props.apperance === "closed") {
      return "default";
    } else {
      return "pointer";
    }
  }};

  background-image: ${(props) => {
    switch (props.apperance) {
      case "defeated": {
        return `url(${zombie_defeated})`;
      }
      case "open": {
        return `url(${zombie})`;
      }
    }
  }};

  &:before {
    content: "";
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 1px;
    padding: 4px;
    left: 4px;
    top: 4px;
    opacity: 0.5;
    border: ${(props) => {
      if (props.isCurrent) {
        return "5px solid #8834b8";
      }
    }};
  }
`;

const EnemiesCardList = styled.div`
  display: flex;
  position: absolute;
`;

export const EnemyList = (props: EnemyArray) => {
  const dispatch = useDispatch();
  const { list: enemyArray, deadPlayerList, activePlayerNumber, coord } = props;
  /*   const enemyArray = props.list; */
  return (
    <EnemiesCardList>
      {enemyArray.map(([index, enemyCard]) => {
        if (deadPlayerList) {
          const isActivePlayerDead = deadPlayerList[activePlayerNumber]
            ? true
            : false;

          switch (isActivePlayerDead) {
            case false: {
              return (
                <EnemyCard
                  key={index}
                  {...enemyCard}
                  isCurrent={false}
                  onClick={() => {
                    dispatch({
                      type: "clickedEnemy",
                      payload: { enemyCard: enemyCard },
                    });
                  }}
                ></EnemyCard>
              );
            }

            case true: {
              return (
                <EnemyCard
                  key={index}
                  {...enemyCard}
                  /*  isCurrent={false} */
                  isCurrent={
                    Number(deadPlayerList[activePlayerNumber].index) ===
                    Number(index)
                  }
                  onClick={() => {
                    dispatch({
                      type: "clickedEnemy",
                      payload: { enemyCard: enemyCard },
                    });
                  }}
                ></EnemyCard>
              );
            }
          }
        } else {
          return (
            <EnemyCard
              key={index}
              {...enemyCard}
              isCurrent={false}
              onClick={() => {
                dispatch({
                  type: "clickedEnemy",
                  payload: { enemyCard: enemyCard },
                });
              }}
            ></EnemyCard>
          );
        }
      })}
    </EnemiesCardList>
  );
};
