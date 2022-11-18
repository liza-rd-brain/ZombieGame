import { CSSProperties, FC, useMemo } from "react";
import { useDrop } from "react-dnd";

import { ItemTypes } from "./ItemTypes";

const style: CSSProperties = {
  height: "12rem",
  width: "12rem",
  marginRight: "1.5rem",
  marginBottom: "1.5rem",
  color: "white",
  padding: "1rem",
  textAlign: "center",
  fontSize: "1rem",
  lineHeight: "normal",
  float: "left",
};

export type BoxProps = {
  keyIndex: number;
  //TODO: добавить и string
  item: number | string;
};

// const checkCanDrop = ({ item, keyIndex }: BoxProps) => {
//   console.log(item, keyIndex);
//   return true;
// };

// const checkCanDropMemo = useMemo(
//   () => checkCanDrop({ item, keyIndex }),
//   [item, keyIndex]
// );

export const DropItem: FC<BoxProps> = ({ item, keyIndex }) => {
  const printDrag = (drag: any) => {
    /*     useMemo(() => { */
    console.log(drag);
    /*     }, [drag]); */
  };

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    // canDrop: (item, monitor) => {
    //   const currDrag = monitor.getItem();
    //   printDrag(currDrag);

    //   return false;
    // } /* (consitem = monitor.getItem()), */,

    drop: () => ({ name: "Dustbin" }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;
  let backgroundColor = "#222";
  if (isActive) {
    backgroundColor = "darkgreen";
  } else if (canDrop) {
    backgroundColor = "darkkhaki";
  }

  return (
    <div ref={drop} style={{ ...style, backgroundColor }} data-testid="dustbin">
      {isActive ? "Release to drop" : "Drag a box here"}
    </div>
  );
};
