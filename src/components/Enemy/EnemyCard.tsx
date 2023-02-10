import { FC } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { CardAppearance, EnemyCardType } from "../../business/types";

import { EnemyView } from "./EnemyView";

type EnemyCardContainerType = {
  needSplitCards?: boolean;
  needReverseCards?: boolean;
};

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
  return (
    <EnemyView
      // key={`deadPlayer${order}`}
      id={`deadPlayer${order}`}
      isCurrent={isCurrent}
      apperance={apperance}
      refList={refList}
      enemyCard={enemyCard}
    />
  );
};
