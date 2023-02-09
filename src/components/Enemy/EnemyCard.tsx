import { FC } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import {
  CardAppearance,
  DeadPlayerListType,
  EnemyCardType,
} from "../../business/types";
import { StyledCommonCard } from "../CommonCard/CommonCard";
import { EnemyView } from "./EnemyView";

import zombie from "./zombie.png";
import zombie_defeated from "./zombie_defeated.png";

type EnemyCardApperanceType = EnemyCardType & {
  isCurrent: boolean;
};

type EnemyCardContainerType = {
  needSplitCards?: boolean;
  needReverseCards?: boolean;
};

const EnemyCardContainer = styled.div<EnemyCardContainerType>`
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

export const EnemyCard: FC<{
  isCurrent: boolean;
  needSplitCards: boolean;
  needReverseCards: boolean;
  apperance: CardAppearance;
  enemyCard: EnemyCardType;
  refList: {
    cardContainerRef: React.RefObject<HTMLDivElement>;
    cardFrontRef: React.RefObject<HTMLDivElement>;
  };
}> = ({
  isCurrent,
  needSplitCards,
  needReverseCards,
  apperance,
  refList,
  enemyCard,
}) => {
  const dispatch = useDispatch();

  return (
    <EnemyCardContainer
      needSplitCards={false}
      needReverseCards={needReverseCards}
    >
      <EnemyView
        apperance={apperance}
        refList={refList}
        enemyCard={enemyCard}
      />
    </EnemyCardContainer>
  );
};
