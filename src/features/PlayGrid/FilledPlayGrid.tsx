import React, { useMemo } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { State } from "../../business/types";
import { Cell } from "./Cell";

const Wrap = styled.div`
  position: relative;
`;

export const FilledPlayGrid: React.FC = React.memo(function _FilledPlayGrid() {
  const orderGameCells = useSelector((state: State) => state.gameField.order);
  const _config = useSelector((state: State) => state._config);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoConfig = useMemo(() => _config, []);

  const fullPlayerGrid = orderGameCells.map((orderIndex: string) => {
    const [hor, vert] = orderIndex.split(".");
    return (
      <Wrap key={`${hor}.${vert}`}>
        <Cell coord={orderIndex} mode={memoConfig.playGridMode} />
      </Wrap>
    );
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedPlayerGrid = useMemo(() => fullPlayerGrid, []);

  return <>{memoizedPlayerGrid}</>;
});
