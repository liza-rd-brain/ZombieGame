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
      return "green";
    }
  }};

  border-color: ${(props) => {
    if (props.apperance === "closed") {
      return "gray";
    } else {
      return "green";
    }
  }};
`;

export const Health = (props: HealthApperanceType) => {
  return <StyledHealthCard {...props}></StyledHealthCard>;
};
