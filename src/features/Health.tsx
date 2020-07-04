import React from "react";

import styled from "styled-components";

import { HealthItem } from "./../app";



const HealthItem = styled.div<HealthItem>`
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
          break;
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

function Health(props: HealthItem) {
  return (
    <HealthItem
      key={`${props.hor}${props.vert}`}
      hor={props.hor}
      vert={props.vert}
      type={props.type}
      apperance={props.apperance}
    ></HealthItem>
  );
}

export default Health;
