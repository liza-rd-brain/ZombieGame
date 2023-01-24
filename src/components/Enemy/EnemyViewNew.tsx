import { FC } from "react";
import styled from "styled-components";
import { StyledCommonCard } from "../CommonCard/CommonCard";
import { CardApperance } from "../../business/types";

import zombie from "./zombie.png";
// import zombie_defeated from "./zombie_defeated.png";

import brainImg from "../CommonCard/brain_4.png";

type WeaponApperanceType = {
  apperance?: "closed" | "open";
  ref: any;
};

const CardContainer = styled.div<WeaponApperanceType>`
  width: 50px;
  height: 50px;
  position: relative;
  transform-style: preserve-3d;
`;

const CardFace = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  backface-visibility: hidden;
`;

const CardFront = styled(CardFace)`
  ${StyledCommonCard}
  background-color: unset;
  background-image: url(${zombie});
  border-color: gray;
`;

const CardBack = styled(CardFace)<{ apperance: "closed" | "open" }>`
  ${StyledCommonCard}
  background-image: url(${brainImg});
  display: ${({ apperance }) => {
    if (apperance === "open") {
      return "none";
    }
  }};
`;

export const EnemyViewNew: FC<{
  apperance: CardApperance;
  refList: {
    cardContainerRef: React.RefObject<HTMLDivElement>;
    cardFrontRef: React.RefObject<HTMLDivElement>;
  };
}> = ({ apperance, refList }) => {
  return (
    <CardContainer ref={refList.cardContainerRef}>
      <CardFront ref={refList.cardFrontRef} />
      <CardBack apperance={apperance} />
    </CardContainer>
  );
};

/* background-image: ${(props) => {
    switch (props.apperance) {
      case "defeated": {
        return `url(${zombie_defeated})`;
      }
      case "open": {
        return `url(${zombie})`;
      }
    }
  }}; */
