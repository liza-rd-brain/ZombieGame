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
  const [arrowState] = useSelector((state) => [state.arrowState]);
  const dispatch = useDispatch();

  const renderArrow = (direction) => {
    return (
      <Arrow
        type={direction}
        onClick={() => {
          if (arrowState === "enable") {
            dispatch({ type: "arrowPressed", payload: direction });
          }
        }}
      >
        >
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
}

export default Arrows;
