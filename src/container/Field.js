import React from "react";
import styled from "styled-components";

const FieldItem = styled.div`
  border: 2px solid red;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const Cell = styled.div`
  border: 1px solid #000;
  width: 30px;
  height: 30px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;
const width = 3;
const height = 3;

/*horizontal,
vertical,*/
const array = new Array(height).fill(0).map((itemVer, indexVer) => {
  return (
    <Row key={indexVer} indexVer={indexVer}>
      {new Array(width).fill({}).map((itemHor, indexHor) => {
        return (
          <Cell
            horizontal={indexHor + 1}
            vertical={indexVer + 1}
            key={`${indexHor}${indexVer}`}
          ></Cell>
        );
      })}
    </Row>
  );
});

const row = console.log(array);

array.length = height;

array.map(() => {});
const cellField = () => {};

function Field() {
  return <FieldItem>{array}</FieldItem>;
}

export default Field;
