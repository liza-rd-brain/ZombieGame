import { useSelector } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";

import { useState } from "react";
import Column from "./column";

import style from "./index.module.scss";

const initialData = {
  tasks: {
    taskFirst: { id: "taskFirst", content: "Take out the garbage" },
    taskSecond: { id: "taskSecond", content: "Watch my favorite show" },
    taskThird: { id: "taskThird", content: "Charge my phone" },
    taskFourth: { id: "taskFourth", content: "Cook dinner" },
  },
  columns: {
    columnFirst: {
      id: "columnFirst",
      title: "To do",
      taskIds: ["taskFirst", "taskSecond", "taskThird", "taskFourth"],
    },
    columnSecond: {
      id: "columnSecond",
      title: "In progress",
      taskIds: [],
    },
    columnThird: {
      id: "columnThird",
      title: "Done",
      taskIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ["columnFirst", "columnSecond", "columnThird"],
};

export const TaskBoardContainer = () => {
  // const { phase, data } = useSelector((state: State) => state);

  return (
    <div className={style.mainContainer}>
      {state.columnOrder.map((columnId) => {
        const column = state.columns[columnId];
        const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

        return <Column key={column.id} column={column} tasks={tasks} />;
      })}
    </div>
  );
};

/* import React, { useState } from "react";
import ReactDOM from "react-dom";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import type { Quote as QuoteType } from "../types";

const initial = Array.from({ length: 10 }, (v, k) => k).map((k) => {
  const custom = {
    id: `id-${k}`,
    content: `Quote ${k}`,
  };

  return custom;
});

const grid = 8;
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// const QuoteItem = styled.div`
//   width: 200px;
//   border: 1px solid grey;
//   margin-bottom: ${grid}px;
//   background-color: lightblue;
//   padding: ${grid}px;
// `;

function Quote({ quote, index }) {
  return (
    <Draggable draggableId={quote.id} index={index}>
      {(provided) => (
        <div
          className={style.quote}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {quote.content}
        </div>
      )}
    </Draggable>
  );
}

const QuoteList = React.memo(function QuoteList({ quotes }) {
  return quotes.map((quote, index) => (
    <Quote quote={quote} index={index} key={quote.id} />
  ));
});

export const TaskBoardContainer = () => {
  const [state, setState] = useState({ quotes: initial });

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const quotes = reorder(
      state.quotes,
      result.source.index,
      result.destination.index
    );

    setState({ quotes });
  }

  return (
    <Droppable droppableId="list">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          <QuoteList quotes={state.quotes} />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
 */
