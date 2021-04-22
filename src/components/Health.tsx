import styled from "styled-components";

import { HealthCardType } from "../business/types";

const StyledHealthCard = styled.div<HealthCardType>`
  position: absolute;
  border: 5px solid;
  width: 15px;
  height: 15px;
  margin: 12px;

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
