import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const Arrow = styled.div`
  /* width: 10px;
  height: 10px; */
  /*  margin: 10px; */
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
    switch (props.type) {
      case "top":
        return "rotate(-90deg)";
      case "bottom":
        return "rotate(90deg)";
      case "left":
        return "rotate(-180deg)";
    }
  }};
  grid-area: ${(props) => {
    switch (props.type) {
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
  width: 50px;
  height: 50px;
  /*   border: 1px solid lightgrey; */
`;

function Arrows() {
  const dispatch = useDispatch();

  const renderArrow = (direction) => {
    switch (direction) {
      case "top":
        return (
          <Arrow
            type="top"
            onClick={() => {
              dispatch({ type: "changeCoordY", payload: 1 });
            }}
          >
            >
          </Arrow>
        );
      case "bottom":
        return (
          <Arrow
            type="bottom"
            onClick={() => {
              dispatch({ type: "changeCoordY", payload: -1 });
            }}
          >
            >
          </Arrow>
        );
      case "right":
        return (
          <Arrow
            type="right"
            onClick={() => {
              dispatch({ type: "changeCoordX", payload: 1 });
            }}
          >
            >
          </Arrow>
        );
      case "left":
        return (
          <Arrow
            type="left"
            onClick={() => {
              dispatch({ type: "changeCoordX", payload: -1 });
            }}
          >
            >
          </Arrow>
        );
      default:
        break;
    }
  };

  return (
    <ArrowContainer>
      {renderArrow("top")}
      {renderArrow("right")}
      {renderArrow("left")}
      {renderArrow("bottom")}
    </ArrowContainer>
  );
}

export default Arrows;
