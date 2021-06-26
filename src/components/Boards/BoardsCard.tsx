import styled from "styled-components";
import { CommonCard } from "../CommonCard/CommonCard";
import img from "./boards.png";

type BoardsApperanceType = {
  apperance?: "closed" | "open";
};

const StyledBoardsCard = styled(CommonCard)<BoardsApperanceType>`
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

export const BoardsCard = (props: BoardsApperanceType) => {
  return (
    <StyledBoardsCard {...props}>
      {/*  {props.apperance === "closed" ? null : "X"} */}
    </StyledBoardsCard>
  );
};
