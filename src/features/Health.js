import React from "react";

import styled from "styled-components";

const HealthItem = styled.div`
  border: 10px solid;

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
  top: 0px;
  left: 0px;
`;

function Health(props) {
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
