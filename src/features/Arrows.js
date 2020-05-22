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
  const [
    manHor,
    manVert,
    startHor,
    startVert,
    endHor,
    endVert,
    dice,
  ] = useSelector((state) => [
    state.man.hor,
    state.man.vert,
    state.startCoord.hor,
    state.startCoord.vert,
    state.endCoord.hor,
    state.endCoord.vert,
    state.dice,
  ]);
  const dispatch = useDispatch();

  const getCoord = (direction) => {
    switch (direction) {
      case "top":
        return manVert < endVert
          ? {
              hor: manHor,
              vert: manVert + 1,
            }
          : 0;
      case "bottom":
        return manVert > startVert
          ? {
              hor: manHor,
              vert: manVert - 1,
            }
          : 0;
      case "right":
        return manHor < endHor
          ? {
              hor: manHor + 1,
              vert: manVert,
            }
          : 0;
      case "left":
        return manHor > startHor
          ? {
              hor: manHor - 1,
              vert: manVert,
            }
          : 0;
      default:
        return 0;
    }
  };

  const renderArrow = (direction) => {
    return (
      <Arrow
        type={direction}
        onClick={() => {
          const coord = getCoord(direction);

          if (dice > 1 && coord) {
            dispatch({ type: "changeCoord", payload: coord }),
              dispatch({ type: "changeDice", payload: dice - 1 });
          } else if (dice === 1 && coord) {
            dispatch({ type: "changeCoord", payload: coord }),
              dispatch({ type: "changeDice", payload: dice - 1 }),
              dispatch({
                type: "changeGameState",
                payload: "бросить кубик",
              });
          } else {
            return;
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
