import React from "react";

import styled from "styled-components";

import { HealthItem } from "../business/types";

const HealthCard = styled.div<HealthItem>`
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

export const Health = (props: HealthItem) => {
  return (
    <HealthCard
      name="health"
      type={props.type}
      apperance={props.apperance}
    ></HealthCard>
  );
};
