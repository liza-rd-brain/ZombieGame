import { FC } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import {
  CardApperance,
  DeadPlayerListType,
  EnemyCardType,
} from "../../business/types";
import { StyledCommonCard } from "../CommonCard/CommonCard";
import { EnemyViewNew } from "./EnemyViewNew";

import zombie from "./zombie.png";
import zombie_defeated from "./zombie_defeated.png";

type EnemyCardApperanceType = EnemyCardType & {
  isCurrent: boolean;
};

type EnemyCardListType = {
  needSplitCards?: boolean;
  needReverseCards?: boolean;
};

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

export const EnemyCardNew: FC<{
  isCurrent: boolean;
  needSplitCards: boolean;
  needReverseCards: boolean;
  apperance: CardApperance;
  refList: {
    cardContainerRef: React.RefObject<HTMLDivElement>;
    cardFrontRef: React.RefObject<HTMLDivElement>;
  };
}> = ({ isCurrent, needSplitCards, needReverseCards, apperance, refList }) => {
  const dispatch = useDispatch();

  return (
    <EnemyCardList
      needSplitCards={needSplitCards}
      needReverseCards={needReverseCards}
    >
      <EnemyViewNew apperance={apperance} refList={refList} />
    </EnemyCardList>
  );
};
