import React from 'react';
import { Task, TaskStatus } from '../../types';
import TaskCard from './TaskCard';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onDragEnd: (result: any) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ title, status, tasks, onDragEnd }) => {
  // Get background color based on status
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

  // Get header color based on status
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
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={`${getColumnColor()} rounded-lg shadow-md h-full border border-gray-200 backdrop-blur-sm bg-white/80 flex flex-col`}>
        <div className={`${getHeaderColor()} rounded-t-lg p-3 text-white font-semibold`}>
          <h3 className="text-lg">{title} ({tasks.length})</h3>
        </div>
        
        <Droppable droppableId={status}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="p-3 flex-grow overflow-y-auto"
              style={{ minHeight: '200px' }}
            >
              {tasks.length === 0 ? (
                <div className="text-center text-gray-500 mt-4">
                  No tasks yet
                </div>
              ) : (
                tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="mb-3"
                      >
                        <TaskCard task={task} />
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default TaskColumn;