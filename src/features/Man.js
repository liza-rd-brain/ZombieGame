import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const ManItem = styled.div`
  border: 10px solid red;
  border-radius: 50%;
  width: 7px;
  height: 7px;
  background-color: red;
  position: absolute;
  top:2px;
  left: 1px;
  z-index: 1;
/*   bottom: ${(props) => `${props.vert * 32 + 4}px`};
  left: ${(props) => `${props.hor * 30 + 4}px`}; */
`;

function Man(props) {
  const [hor, vert] = useSelector((state) => [state.manCoord.hor, state.manCoord.vert]);
  if (hor === props.hor && vert === props.vert) {
    return <ManItem hor={hor} vert={vert}></ManItem>;
  } else return <></>;
}

export default Man;
