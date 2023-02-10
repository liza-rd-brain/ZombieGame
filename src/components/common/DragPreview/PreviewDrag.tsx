import { ItemDragTypes } from "../../../shared/ItemTypes";
import styled from "styled-components";

import type { XYCoord } from "react-dnd";
import { useDragLayer } from "react-dnd";
import { StyledCommonPlayerCard } from "./StyledCommonPlayerCard";
import ReactDOM from "react-dom";

const StyledPreviewWrap = styled.div`
  position: absolute !important;
  pointer-events: none;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

type PortalType = {
  coordX: string;
  coordY: string;
};

const PLayersPortal = styled.div<PortalType>`
  position: relative;
  display: flex;
  left: ${(props) => {
    return `${Number(props.coordX) * 50}px`;
  }};

  bottom: ${(props) => {
    return `${Number(props.coordY) * 50 + 50}px`;
  }};
`;

export const PreviewDrag = ({ isCurrent, image, coordX, coordY }: any) => {
  // const [gameStateType] = useSelector((state: State) => [state.gameState.type]);
  const { isDragging, initialOffset, currentOffset, itemType } = useDragLayer(
    (monitor) => ({
      /*       item: monitor.getItem(), */
      itemType: monitor.getItemType(),
      isDragging: monitor.isDragging(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getDifferenceFromInitialOffset(),
    })
  );

  if (isDragging) {
    // console.log("isDragging");
  }

  function getItemStyles(
    initialOffset: XYCoord | null,
    currentOffset: XYCoord | null
  ) {
    if (!initialOffset || !currentOffset) {
      return {
        display: "none",
      };
    }

    let { x, y } = currentOffset;

    const transform = `translate(${x}px, ${y}px)`;
    return {
      transform,
      WebkitTransform: transform,
    };
  }

  const fieildElem = document.getElementById("field");

  function renderItem() {
    switch (itemType) {
      case ItemDragTypes.PLAYER:
        const styledPreview = (
          <StyledPreviewWrap>
            <div style={getItemStyles(initialOffset, currentOffset)}>
              {/* <div style={{ ...styles }}></div> */}
              <StyledCommonPlayerCard image={image} isCurrent={isCurrent} />
            </div>
          </StyledPreviewWrap>
        );
        switch (fieildElem) {
          case null: {
            return styledPreview;
          }
          default: {
            const portal = ReactDOM.createPortal(
              <PLayersPortal coordX={coordX} coordY={coordY}>
                {styledPreview}
              </PLayersPortal>,
              fieildElem
            );
            return portal;
          }
        }

      default:
        return null;
    }
  }

  if (!isDragging || !isCurrent) {
    if (isCurrent) {
    }

    return null;
  } else {
    return renderItem();
  }

  // <StyledPreviewWrap>
  //   <div style={getItemStyles(initialOffset, currentOffset)}>
  //     {renderItem()}
  //   </div>
  // </StyledPreviewWrap>
};
