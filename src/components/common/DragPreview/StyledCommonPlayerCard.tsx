import styled from "styled-components";

export const StyledCommonPlayerCard = styled.div<{
  image: string;
  isCurrent: boolean;
}>`
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
`;
