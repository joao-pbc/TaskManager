import React from 'react';
import { Task, TaskStatus } from '../../types';
import TaskCard from './TaskCard';
import { Droppable, Draggable } from 'react-beautiful-dnd';

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  isDragging?: boolean;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ title, status, tasks, isDragging }) => {
  const getColumnColor = () => {
    switch (status) {
      case 'todo':
        return 'bg-blue-50';
      case 'in-progress':
        return 'bg-amber-50';
      case 'done':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  };

  const getHeaderColor = () => {
    switch (status) {
      case 'todo':
        return 'bg-blue-500';
      case 'in-progress':
        return 'bg-amber-500';
      case 'done':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`${getColumnColor()} rounded-lg shadow-md h-full border border-gray-200 backdrop-blur-sm bg-white/80 flex flex-col transition-colors ${isDragging ? 'ring-2 ring-indigo-300' : ''}`} style={{ position: 'relative' }}>
      <div className={`${getHeaderColor()} rounded-t-lg p-3 text-white font-semibold`}>
        <h3 className="text-lg">{title} ({tasks.length})</h3>
      </div>
      
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="p-3 flex-grow"
            style={{
              position: 'relative',
              zIndex: snapshot.isDraggingOver ? 30 : 'auto'
            }}
          >
            {tasks.map((task, index) => (
              <Draggable 
                key={task.id} 
                draggableId={task.id} 
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-3"
                    style={{
                      ...provided.draggableProps.style,
                      position: snapshot.isDragging ? 'fixed' : 'relative',
                      top: snapshot.isDragging ? `${snapshot.draggingOver ? 0 : 0}px` : 'auto',
                      left: snapshot.isDragging ? `${snapshot.draggingOver ? 0 : 0}px` : 'auto',
                      width: snapshot.isDragging ? 'auto' : '100%',
                      zIndex: snapshot.isDragging ? 9999 : 'auto'
                    }}
                  >
                    <TaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;