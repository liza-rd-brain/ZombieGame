import { FC } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { CardAppearance, EnemyCardType } from "../../business/types";

import { EnemyView } from "./EnemyView";

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
  order: string;
  refList: {
    cardContainerRef: React.RefObject<HTMLDivElement>;
    cardFrontRef: React.RefObject<HTMLDivElement>;
  };
}> = ({
  needSplitCards,
  needReverseCards,
  apperance,
  refList,
  enemyCard,
  isCurrent,
  order,
}) => {
  // console.log("needSplitCards", needSplitCards);
  return (
    <EnemyCardContainer
      needSplitCards={needSplitCards}
      needReverseCards={needReverseCards}
    >
      <EnemyView
        id={`deadPlayer${order}`}
        isCurrent={isCurrent}
        apperance={apperance}
        refList={refList}
        enemyCard={enemyCard}
      />
    </EnemyCardContainer>
  );
};
