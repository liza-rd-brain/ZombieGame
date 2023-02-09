import React from "react";
import { useDispatch } from "react-redux";

import styled from "styled-components";

import { MoveDirection } from "../business/types";

type ArrowProps = {
  direction: MoveDirection;
};

const Arrow = styled.div<ArrowProps>`
  text-align: center;
  vertical-align: middle;
  border: 1px solid lightgrey;
  cursor: pointer;
  &:hover {
    color: pink;
  }

  &:active {
    color: red;
  }

  transform: ${(props) => {
    switch (props.direction) {
      case "top":
        return "rotate(-90deg)";
      case "bottom":
        return "rotate(90deg)";
      case "left":
        return "rotate(-180deg)";
    }
  }};

  grid-area: ${(props) => {
    switch (props.direction) {
      case "top":
        return "arrow_top;";
      case "bottom":
        return "arrow_bottom";
      case "left":
        return "arrow_left";
      case "right":
        return "arrow_right";
    }
  }};
`;

const ArrowContainer = styled.div`
  display: grid;
  grid-template-areas:
    ". arrow_top ."
    "arrow_left . arrow_right "
    ". arrow_bottom . ";
  width: 100px;
  height: 100px;
  & > * {
    padding: 6px;
    box-sizing: border-box;
    background-color: white;
  }
`;

export const MoveControls = () => {
  const dispatch = useDispatch();

  const renderArrow = (direction: MoveDirection) => {
    return (
      <Arrow
        direction={direction}
        onClick={() => {
          dispatch({ type: "moveControlsClicked", payload: direction });
        }}
      >
        &gt;
      </Arrow>
    );
  };

  return (
    <ArrowContainer>
      {renderArrow("top")}
      {renderArrow("right")}
      {renderArrow("left")}
      {renderArrow("bottom")}
    </ArrowContainer>
  );
};
