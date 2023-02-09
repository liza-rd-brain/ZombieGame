import { FC, useEffect } from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";
import { useDrag } from "react-dnd";

import { ItemDragTypes } from "../../shared/ItemTypes";
import { State } from "../../business/types";
import { PreviewDrag } from "./PreviewDrag";
import { StyledCommonPlayerCard } from "./StyledCommonPlayerCard";
import { getEmptyImage } from "react-dnd-html5-backend";

const StyledPlayerCard = styled(StyledCommonPlayerCard)<
  Omit<PlayerItemProps, "coordX" | "coordY">
>`
  z-index: ${(props) => {
    if (props.isCurrent) {
      return "10";
    } else {
      return "3";
    }
  }};

  &:after {
    content: "";
    position: absolute;
    width: 36px;
    height: 36px;
    border-radius: 1px;
    padding: 4px;
    left: 0px;
    top: 0px;

    border: ${(props) => {
      if (props.needHighlightning) {
        return "3px solid rgb(55 163 0 / 52%);";
      }
    }};
  }
`;

type PlayerStyleProps = {
  isCurrent: boolean;
  needHighlightning?: boolean;
  image: string;
  coordX: string;
  coordY: string;
};

type PlayerItemProps = {
  id: string;
  onClick: any;
} & PlayerStyleProps;

export const PlayerCard: FC<PlayerItemProps> = ({
  id,
  isCurrent,
  needHighlightning,
  image,
  onClick,
  coordX,
  coordY,
}) => {
  const [gameStateType] = useSelector((state: State) => [state.gameState.type]);

  const playerCardCanBeDragged =
    gameStateType === "gameStarted.playerMove" && isCurrent;

  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      item: { id: id },
      type: ItemDragTypes.PLAYER,
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
      canDrag: (monitor) => {
        return playerCardCanBeDragged;
      },
    }),
    [id, gameStateType]
  );

  //Hide initial preview on dragging
  useEffect(() => {
    if (dragPreview) {
      dragPreview(getEmptyImage(), { captureDraggingState: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <StyledPlayerCard
        style={{
          opacity: isDragging ? 0 : 1,
        }}
        ref={drag}
        id={id}
        isCurrent={isCurrent}
        needHighlightning={needHighlightning}
        image={image}
        onClick={onClick}
      />
      <PreviewDrag
        isCurrent={isCurrent}
        image={image}
        coordX={coordX}
        coordY={coordY}
      />
    </>
  );
};
