import { FC, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import styled, { keyframes, css } from "styled-components";
import { CardApperance, State } from "../../business/types";
import { StyledCommonCard } from "../CommonCard/CommonCard";
import { useOpenCardAnimation } from "../../business/effects/useOpenCardAnimation";

import img from "./boards.png";
import brainImg from "../CommonCard/brain_4.png";

type BoardsApperanceType = {
  apperance?: "closed" | "open";
};

const flipCard = keyframes`
from{
  transform: rotateY(0deg);
}
 to {
    transform: rotateY(180deg);
  }`;

const flipFrontCard = keyframes`
from{
  transform: rotateY(90deg);
}
 to {
    transform: rotateY(180deg);
  }`;

// const animationCondition = () => css`
//   ${flipCard}
// `;

const CardContainer = styled.div<BoardsApperanceType>`
  width: 50px;
  height: 50px;
  position: relative;
  /* transition: transform 3s; */
  //to set 3d to children of card
  transform-style: preserve-3d;
  animation-timing-function: linear;
  animation: ${({ apperance }) => {
    if (apperance === "open") {
      return flipCard;
    }
  }};
  animation-duration: 5s;
  animation-fill-mode: forwards;
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
  animation: ${flipFrontCard};
  animation-duration: 5s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  /* transform: rotateY(180deg); */
`;

const CardBack = styled(CardFace)<BoardsApperanceType>`
  ${StyledCommonCard}
  background-image: url(${brainImg});
  animation-duration: 5s;
  animation: ${flipCard};
  /* animation: ${({ apperance }) => {
    if (apperance === "open") {
      return flipCard;
    }
  }}; */
`;

export const BoardsCard: FC<{ apperance: CardApperance; coord: string }> = ({
  apperance,
  coord,
}) => {
  // const { doEffect, playerList, activePlayerNumber } = useSelector(
  //   (state: State) => ({ ...state })
  // );

  // const currCoord = playerList[activePlayerNumber].coord;

  // return useMemo(() => {
  //   return <MemoizedCard apperance={apperance} coord={coord} />;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currCoord]);
  console.log("перерисовка");
  return (
    <CardContainer
      apperance={apperance}
      /* onAnimationEnd={() => {
        console.log("end animation CardContainer");
      }} */
    >
      <CardFront
      /*    onAnimationEnd={() => {
          console.log("end animation CardFront");
        }} */
      />
      <CardBack apperance={apperance} />
    </CardContainer>
  );
};

// useMemo(() => computeExpensiveValue(a, b), [a, b]);
