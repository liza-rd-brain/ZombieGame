import { FC } from "react";
import { useSelector } from "react-redux";
import { useDrag } from "react-dnd";
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

type PlayerStyleProps = {
  isCurrent: boolean;
  needHighlightning?: boolean;
  image: string;
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
}) => {
  const gameStateType = useSelector((state: State) => state.gameState.type);
  const playerCardCanBeDragged =
    gameStateType === "gameStarted.playerMove" && isCurrent;
  console.log(playerCardCanBeDragged);
  /**
   * canDrag - we can drag cards
   * type=gameStarted.playerMove
   */
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemDragTypes.PLAYER,
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
      // canDrag: playerCardCanBeDragged,
      canDrag: (monitor) => {
        console.log("playerCardCanBeDragged", playerCardCanBeDragged);
        return playerCardCanBeDragged;
      },
    }),
    [gameStateType]
  );

  return (
    <StyledPlayerCard
      ref={drag}
      id={id}
      isCurrent={isCurrent}
      needHighlightning={needHighlightning}
      image={image}
      onClick={onClick}
    />
  );
};
