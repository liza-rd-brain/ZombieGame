import React from "react";

import { Droppable } from "react-beautiful-dnd";
import Task from "./task";

import style from "./index.module.scss"; // import "./index.module.scss";

// const Container = styled.div`
//   margin: 8px;
//   border: 1px solid lightgrey;
//   border-radius: 2px;
//   width: 220px;

//   display: flex;
//   flex-direction: column;
// `;

// const Title = styled.h3`
//   padding: 8px;
// `;

// const TaskList = styled.div`
//   padding: 8px;
//   transition: background-color 0.2s ease;
//   background-color: ${(props) => (props.isDraggingOver ? "skyblue" : "white")};
//   flex-grow: 1;
//   min-height: 100px;
// `;

const Column = ({ column, tasks }) => {
  return (
    <div className={style.columnContainer} d>
      <div className={style.titleColumn}>{column.title}</div>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            className={style.taskListColumn}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
