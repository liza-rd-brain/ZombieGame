import styled from "styled-components";

import { HealthCardType } from "../business/types";

const StyledHealthCard = styled.div<HealthCardType>`
  width: 10px;
  height: 10px;
  position: absolute;
  border: 5px solid;
  margin: 4px;

  background-color: ${(props) => {
    if (props.apperance === "closed") {
      return "gray";
    } else {
      switch (props.type) {
        case "increment":
          return "green";
        case "decrement":
          return "orange";
        default:
          return "black";
      }
    }
  }};

  border-color: ${(props) => {
    if (props.apperance === "closed") {
      return "gray";
    } else {
      switch (props.type) {
        case "increment":
          return "green";
        case "decrement":
          return "orange";
        default:
          break;
      }
    }
  }};
`;

export const Health = (props: HealthCardType) => {
  return <StyledHealthCard {...props} />;
};
