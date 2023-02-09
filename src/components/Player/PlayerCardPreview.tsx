import { CSSProperties, FC, useEffect } from "react";
import { useSelector } from "react-redux";

import type { XYCoord } from "react-dnd";
import { useDrag, DragPreviewImage, useDragLayer } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import styled from "styled-components";

import { ItemDragTypes } from "../../shared/ItemTypes";
import { State } from "../../business/types";

const StyledPlayerCard = styled.div<PlayerItemProps>`
  width: 50px;
  height: 50px;
  margin: 0px;
  text-align: center;
  padding: 2px;
  box-sizing: border-box;
  cursor: default;
  background-repeat: no-repeat;
  background-position: 0px;
  background-size: 44px;
  background-position: 3px;

  background-image: ${(props) => {
    return `url(${props.image})`;
  }};

  z-index: ${(props) => {
    if (props.isCurrent) {
      return "10";
    } else {
      return "3";
    }
  }};

  &:before {
    content: "";
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 1px;

    border: ${(props) => {
      if (props.isCurrent) {
        return "5px solid #8834b8";
      }
    }};

    pointer-events: none;
    opacity: 0.5;
    padding: 4px;
    left: 4px;
    top: 4px;
  }

  &:after {
    content: "";
    position: absolute;
    width: 36px;
    height: 36px;
    border-radius: 1px;

    border: ${(props) => {
      if (props.needHighlightning) {
        return "3px solid rgb(55 163 0 / 52%);";
      }
    }};

    padding: 4px;
    left: 0px;
    top: 0px;
  }
`;

const StyledPreviewWrap = styled.div`
  /* position: fixed; */
  pointer-events: none;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

type PlayerStyleProps = {
  isCurrent: boolean;
  needHighlightning?: boolean;
  image: string;
};

type PlayerItemProps = {
  id: string;
  onClick: any;
} & PlayerStyleProps;

export const PlayerCardPreview = ({ playerId }: any) => {
  const { isDragging, initialOffset, currentOffset, itemType, item } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      isDragging: monitor.isDragging(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getDifferenceFromInitialOffset(),
    }));

  const styles: CSSProperties = {
    border: "1px solid red",
    backgroundColor: "red",
    padding: "0.5rem 1rem",
    cursor: "move",
  };

  function getItemStyles(
    initialOffset: XYCoord | null,
    currentOffset: XYCoord | null,
    isSnapToGrid?: boolean
  ) {
    if (!initialOffset || !currentOffset) {
      return {
        display: "none",
      };
    }

    let { x, y } = currentOffset;
    /*     console.log(x, y); */
    // - Half of card size
    const transform = `translate(${x - 30}px, ${y}px)`;
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
              <div style={{ ...styles }}></div>
            </div>
          </StyledPreviewWrap>
        );
      default:
        return null;
    }
  }

  const isCurrent = item && playerId === item.id;

  if (item) {
    // console.log(playerId, item.id, isCurrent);
  }

  if (!isDragging || !isCurrent) {
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
