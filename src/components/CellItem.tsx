import { FC } from "react";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { PlayGridMode } from "../business/types";
import { ItemDragTypes } from "../shared/ItemTypes";

type CellAppearance = {
  needHighlightning?: boolean;
  mode: PlayGridMode;
};

type CellItemType = {
  hor: string;
  vert: string;
  children: React.ReactNode;
} & CellAppearance;

const StyledCellItem = styled.div<CellAppearance>`
  display: flex;
  position: relative;
  box-sizing: border-box;

  font-size: 14px;
  text-align: right;
  width: 50px;
  height: 50px;
  color: lightgrey;

  border: ${(props) => {
    if (props.mode === "cssStyle") {
      return "1px solid lightgray";
    }
  }};

  background-color: ${(props) => {
    if (props.needHighlightning) {
      return "rgb(55 163 0 / 52%);";
    }
  }};
`;

export const CellItem: FC<CellItemType> = ({
  needHighlightning,
  mode,
  children,
  hor,
  vert,
}) => {
  const dispatch = useDispatch();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemDragTypes.PLAYER,
    drop: () => dispatch({ type: "moveControlsClicked", payload: "top" }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    hover: () => {
      console.log("hover", hor, vert);
    },
  }));
  return (
    <>
      <StyledCellItem
        ref={drop}
        needHighlightning={needHighlightning}
        mode={mode}
      >
        {children}
      </StyledCellItem>
      {/* {isOver && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: "yellow",
          }}
        />
      )} */}
    </>
  );
};
