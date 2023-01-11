import { ItemDragTypes } from "../../shared/ItemTypes";
import styled from "styled-components";

import type { XYCoord } from "react-dnd";
import { useDragLayer } from "react-dnd";
import { StyledCommonPlayerCard } from "./StyledCommonPlayerCard";

const StyledPreviewWrap = styled.div`
  position: absolute !important;
  pointer-events: none;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

export const PreviewDrag = ({ isCurrent, image }: any) => {
  const { isDragging, initialOffset, currentOffset, itemType } = useDragLayer(
    (monitor) => ({
      /*       item: monitor.getItem(), */
      itemType: monitor.getItemType(),
      isDragging: monitor.isDragging(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getDifferenceFromInitialOffset(),
    })
  );

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

  function renderItem() {
    switch (itemType) {
      case ItemDragTypes.PLAYER:
        return (
          <StyledPreviewWrap>
            <div style={getItemStyles(initialOffset, currentOffset)}>
              {/* <div style={{ ...styles }}></div> */}
              <StyledCommonPlayerCard image={image} isCurrent={isCurrent} />
            </div>
          </StyledPreviewWrap>
        );
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
