import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

const ManItem = styled.div`
  border: 10px solid red;
  border-radius: 50%;
  width: 7px;
  height: 7px;
  background-color: red;
  position: absolute;
  bottom: ${(props) => `${props.vert * 32 + 4}px`};
  /*   bottom: 4px; */
  left: ${(props) => `${props.hor * 30 + 4}px`};
`;

function Man() {
  /*   const state = useSelector((state) => state); */
  const [hor, vert] = useSelector((state) => [state.man.hor, state.man.vert]);
  return <ManItem hor={hor} vert={vert}></ManItem>;
}

export default Man;
