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

type EnemyCardListType = {
  needSplitCards?: boolean;
  needReverseCards?: boolean;
};

const EnemyCard = styled.div<EnemyCardApperanceType>`
  ${StyledCommonCard}
  position: static;
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

  z-index: ${(props) => {
    switch (props.isCurrent) {
      case true: {
        return "4";
      }
      case false: {
        switch (props.apperance) {
          case "open": {
            return "3";
          }
          default: {
            return "2";
          }
        }
      }
      default: {
        return "2";
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

const EnemyCardList = styled.div<EnemyCardListType>`
  display: flex;
  flex-wrap: nowrap;
  position: absolute;
  font-size: 12px;
  font-weight: bold;
  flex-direction: ${(props) => {
    if (props.needReverseCards) {
      return "row-reverse";
    } else {
      return "row";
    }
  }};

  margin: ${(props) => {
    if (props.needSplitCards) {
      return " 0 0 !important;";
    }
  }};

  > * {
    position: ${(props) => {
      if (props.needSplitCards) {
        return "relative !important";
      }
    }};

    margin: ${(props) => {
      if (props.needSplitCards) {
        return "0 -12px";
      }
    }};
  }
`;

export const EnemyList = (props: EnemyArray) => {
  const dispatch = useDispatch();
  const { list: enemyArray, deadPlayerList, activePlayerNumber } = props;

  const enemyListOnCell = enemyArray.map((enemyItem) => {
    const [, enemyCard] = enemyItem;
    return enemyCard;
  });

  const needSplitCards = enemyListOnCell.length > 1;

  const firstItemIsClosed = enemyListOnCell[0].apperance === "closed";

  const indexOfActiveCard = enemyArray.findIndex(([index, enemyCard]) => {
    if (deadPlayerList && deadPlayerList[activePlayerNumber]) {
      return Number(index) === Number(deadPlayerList[activePlayerNumber].index);
    } else {
      return -1;
    }
  });

  const needReverseCards =
    (indexOfActiveCard !== 0 && needSplitCards) ||
    (firstItemIsClosed && needSplitCards);

  return (
    <EnemyCardList
      needSplitCards={needSplitCards}
      needReverseCards={needReverseCards}
    >
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
            default: {
              return null;
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
    </EnemyCardList>
  );
};
