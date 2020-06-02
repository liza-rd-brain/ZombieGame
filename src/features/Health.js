import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const HealthItem = styled.div`
  border: 10px solid green;
  border-radius: 50%;
  width: 7px;
  height: 7px;
  background-color: green;
  position: absolute;
  top:2px;
  left: 1px;
/*   bottom: ${(props) => `${props.vert * 32 + 4}px`};
  left: ${(props) => `${props.hor * 30 + 4}px`}; */
`;

function Health(props) {
  /*   const coord = useSelector((state) => state.healthCoord); */
  /*размапить массив */

  /*  return coord.map((item, index) => (
    <HealthItem
      key={`${props.hor}${props.vert}`}
      hor={props.hor}
      vert={props.vert}
    ></HealthItem>
  ));
 */
  return (
    <HealthItem
      key={`${props.hor}${props.vert}`}
      hor={props.hor}
      vert={props.vert}
    ></HealthItem>
  );

  /* return <Health></Health>; */
}

export default Health;
