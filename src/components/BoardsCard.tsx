import styled from "styled-components";

type BoardsApperanceType = {
  apperance?: "closed" | "open";
};

const StyledBoardsCard = styled.div<BoardsApperanceType>`
  position: absolute;
  border: 1px solid;
  width: 20px;
  height: 20px;
  margin: 12px;
  color: black;
  font-size: 20px;
  text-align: center;
  background-color: ${(props) => {
    if (props.apperance === "closed") {
      return "gray";
    } else {
      return "white";
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
