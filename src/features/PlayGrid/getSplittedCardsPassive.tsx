import styled from "styled-components";
import ReactDOM from "react-dom";

type PortalType = {
  coordX: string;
  coordY: string;
};

const CardsPortal = styled.div<PortalType>`
  position: relative;
  display: flex;
  left: ${(props) => {
    return `${Number(props.coordX) * 50}px`;
  }};

  bottom: ${(props) => {
    return `${Number(props.coordY) * 50 + 50}px`;
  }};
`;

const CardsWrap = styled.div`
  display: flex;
  flex-wrap: nowrap;
  position: absolute;
  z-index: 3;
  font-size: 12px;
  font-weight: bold;
  /*   flex-direction: row-reverse; */
  > * {
    position: relative !important;
    margin: 0 -12px;

    /*     margin: 0px -41px;
    left: -54px; */
  }
`;

/**
 * card splitted, but not in some action
 */
export const getSplittedCardsPassive = (
  cardList: JSX.Element,
  orderIndex: string
) => {
  const fieildElem = document.getElementById("field");
  switch (fieildElem) {
    case null: {
      return cardList;
    }
    default: {
      const [hor, vert] = orderIndex.split(".");

      const portal = ReactDOM.createPortal(
        <CardsPortal coordX={hor} coordY={vert}>
          <CardsWrap>{cardList}</CardsWrap>
        </CardsPortal>,
        fieildElem
      );

      return portal;
    }
  }
};
