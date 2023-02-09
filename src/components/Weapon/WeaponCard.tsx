import styled from "styled-components";
import { StyledCommonCard } from "../CommonCard/CommonCard";
import { CardAppearance } from "../../business/types";
import img from "./weapon.png";
import brainImg from "../CommonCard/brain_4.png";
import { FC } from "react";

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
  background-image: url(${img});
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

export const WeaponCard: FC<{
  apperance: CardAppearance;
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
