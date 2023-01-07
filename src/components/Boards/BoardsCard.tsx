import styled from "styled-components";
import { StyledCommonCard } from "../CommonCard/CommonCard";

import img from "./boards.png";

type BoardsAppearanceType = {
  appearance?: "closed" | "open";
};

const StyledBoardsCard = styled.div<BoardsAppearanceType>`
  ${StyledCommonCard}
  background-color: ${(props) => {
    if (props.appearance === "open") {
      return "unset";
    }
  }};

  background-image: ${(props) => {
    if (props.appearance === "open") {
      return `url(${img})`;
    }
  }};

  border-color: ${(props) => {
    if (props.appearance === "open") {
      return "gray";
    }
  }};
`;

export const BoardsCard = (props: BoardsAppearanceType) => {
  return (
    <StyledBoardsCard {...props}>
      {/*  {props.appearance === "closed" ? null : "X"} */}
    </StyledBoardsCard>
  );
};
