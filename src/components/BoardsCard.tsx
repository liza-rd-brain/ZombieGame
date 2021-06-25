import styled from "styled-components";
import { CommonCard } from "./CommonCard/CommonCard";

type BoardsApperanceType = {
  apperance?: "closed" | "open";
};

const StyledBoardsCard = styled(CommonCard)<BoardsApperanceType>`
  color: black;
  font-size: 20px;
  text-align: center;
  background-color: ${(props) => {
    if (props.apperance !== "closed") {
      return "white";
    } else {
      return "";
    }
  }};

  border-color: ${(props) => {
    if (props.apperance === "closed") {
      return "gray";
    } else {
      return "gray";
    }
  }};
`;

export const BoardsCard = (props: BoardsApperanceType) => {
  return (
    <StyledBoardsCard {...props}>
      {props.apperance === "closed" ? null : "X"}
    </StyledBoardsCard>
  );
};
