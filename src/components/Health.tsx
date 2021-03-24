import React from "react";

import styled from "styled-components";

import { HealthCardType } from "../business/types";

const StyledHealthCard = styled.div<HealthCardType>`
  border: 5px solid;

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

  width: 10px;
  height: 10px;

  position: absolute;
  top: 5px;
  left: 5px;
`;

export const Health = (props: HealthCardType) => {
  return <StyledHealthCard {...props} />;
};
