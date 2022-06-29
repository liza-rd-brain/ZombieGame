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

const StyledCellItem = styled.div<CellAppearance & { isOver: boolean }>`
  display: flex;
  position: relative;
  box-sizing: border-box;

  font-size: 14px;
  text-align: right;
  width: 50px;
  height: 50px;
  color: lightgrey;

  border: ${({ mode }) => {
    if (mode === "cssStyle") {
      return "1px solid lightgray";
    }
  }};

  background-color: ${({ needHighlightning, isOver }) => {
    if (needHighlightning) {
      return isOver ? "yellow" : "rgb(55 163 0 / 52%);";
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
    //rename moveControlsClicked to cellChosen
    // drop: () => dispatch({ type: "moveControlsClicked", payload: "top" }),
    drop: () =>
      dispatch({
        type: "playerWasMoved",
        payload: {
          hor,
          vert,
        },
      }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    hover: () => {
      // console.log("hover", hor, vert);
    },
  }));

  return (
    <>
      <StyledCellItem
        ref={drop}
        needHighlightning={needHighlightning}
        mode={mode}
        isOver={isOver}
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
