import { FC, useState } from "react";
import styled from "styled-components";
import { CardApperance } from "../../business/types";
import { StyledCommonCard } from "../CommonCard/CommonCard";
import img from "./boards.png";
import brainImg from "../CommonCard/brain_4.png";

type BoardsApperanceType = {
  apperance?: "closed" | "open";
};

const CardContainer = styled.div<BoardsApperanceType>`
  width: 50px;
  height: 50px;
  position: relative;
  transition: transform 3s;
  //to set 3d to children of card
  transform-style: preserve-3d;
  transform: ${({ apperance }) => {
    if (apperance === "open") {
      return "rotateY(180deg)";
    }
  }};
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
  transform: rotateY(180deg);
`;

const CardBack = styled(CardFace)`
  ${StyledCommonCard}
  background-image: url(${brainImg});
`;

const StyledBoardsCard = styled.div<BoardsApperanceType>`
  ${StyledCommonCard}

  background-color: ${(props) => {
    if (props.apperance === "open") {
      return "unset";
    }
  }};

  background-image: ${(props) => {
    if (props.apperance === "open") {
      return `url(${img})`;
    }
  }};

  border-color: ${(props) => {
    if (props.apperance === "open") {
      return "gray";
    }
  }};
`;

export const BoardsCard: FC<{ apperance: CardApperance }> = ({ apperance }) => {
  // const [openState, setOpen] = useState({ isOpen: apperance });
  return (
    <CardContainer
      apperance={apperance}
      onAnimationEnd={() => {
        console.log("end animation");
      }}
    >
      <CardFront
        onAnimationEnd={() => {
          console.log("end animation");
        }}
      />
      <CardBack
        onAnimationEnd={() => {
          console.log("end animation");
        }}
      />
      {/* <StyledBoardsCard apperance={"open"} />
      <StyledBoardsCard apperance={"closed"} /> */}
    </CardContainer>
  );
};
