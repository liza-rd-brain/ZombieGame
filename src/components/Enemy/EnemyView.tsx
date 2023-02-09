import { FC, useEffect } from "react";
import styled from "styled-components";
import { useDrag } from "react-dnd";

import { ItemDragTypes } from "../../shared/ItemTypes";
import { StyledCommonCard } from "../common/CommonCard";
import { CardAppearance, EnemyCardType, State } from "../../business/types";

import zombie from "./zombie.png";
// import zombie_defeated from "./zombie_defeated.png";

import brainImg from "../common/CommonCard/brain_4.png";
import { useDispatch, useSelector } from "react-redux";
import { getEmptyImage } from "react-dnd-html5-backend";
import { PreviewDrag } from "../common/DragPreview/PreviewDrag";

type WeaponApperanceType = {
  apperance?: "closed" | "open";
  ref: any;
};

const CardContainer = styled.div<WeaponApperanceType>`
  width: 50px;
  height: 50px;
  position: relative;
  transform-style: preserve-3d;
`;

const CardFace = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  backface-visibility: hidden;
`;

const CardFront = styled(CardFace)`
  ${StyledCommonCard}
  background-color: unset;
  background-image: url(${zombie});
  border-color: gray;
`;

const CardBack = styled(CardFace)<{ apperance: "closed" | "open" }>`
  ${StyledCommonCard}
  background-image: url(${brainImg});
  display: ${({ apperance }) => {
    if (apperance === "open") {
      return "none";
    }
  }};
`;

export const EnemyView: FC<{
  id: string;
  apperance: CardAppearance;
  enemyCard: EnemyCardType;
  isCurrent: boolean;
  refList: {
    cardContainerRef: React.RefObject<HTMLDivElement>;
    cardFrontRef: React.RefObject<HTMLDivElement>;
  };
}> = ({ id, apperance, refList, enemyCard, isCurrent }) => {
  const dispatch = useDispatch();

  const [gameStateType] = useSelector((state: State) => [state.gameState.type]);

  const [hor, vert] = enemyCard.coord.split(".");

  const enemyCardCanBeDragged = gameStateType === "enemyMove" && isCurrent;
  /*   console.log("enemyCardCanBeDragged", enemyCardCanBeDragged); */

  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      item: { id: id },
      type: ItemDragTypes.PLAYER,
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
      canDrag: (monitor) => {
        return enemyCardCanBeDragged;
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

  /**
   * CardContainer ref-нужен для передачи ссылки на карточку и для навешивания драг
   */
  return (
    <>
      <CardContainer
        style={{
          opacity: isDragging ? 0 : 1,
        }}
        ref={apperance === "closed" ? refList.cardContainerRef : drag}
        onClick={() => {
          dispatch({
            type: "clickedEnemy",
            payload: { enemyCard: enemyCard },
          });
        }}
      >
        <CardFront ref={refList.cardFrontRef} />
        <CardBack apperance={apperance} />
      </CardContainer>
      <PreviewDrag
        isCurrent={isCurrent}
        image={zombie}
        coordX={hor}
        coordY={vert}
      />
    </>
  );
};
