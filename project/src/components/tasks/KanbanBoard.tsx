import React, { useState } from 'react';
import { TaskStatus } from '../../types';
import TaskColumn from './TaskColumn';
import TaskForm from './TaskForm';
import { Plus } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { DragDropContext, DropResult, DragStart } from 'react-beautiful-dnd';

const KanbanBoard: React.FC = () => {
  const { tasks, loading, updateTaskStatus } = useTasks();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);

  const columns: { id: TaskStatus; title: string }[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ];

  // Group tasks by status
  const tasksByStatus = columns.reduce((acc, column) => {
    acc[column.id] = tasks.filter(task => task.status === column.id);
    return acc;
  }, {} as Record<TaskStatus, typeof tasks>);

  const handleDragStart = (initial: DragStart) => {
    setIsDragging(true);
    setDragError(null);
  };

  // Handle drag end
  const handleDragEnd = async (result: DropResult) => {
    setIsDragging(false);
    const { draggableId, destination, source } = result;
    
    // If dropped outside a droppable area or in the same position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Verify the task exists before attempting to update
    const taskToUpdate = tasks.find(task => task.id === draggableId);
    if (!taskToUpdate) {
      setDragError(`Error: Task not found`);
      return;
    }
    
    const newStatus = destination.droppableId as TaskStatus;
    
    try {
      // Update task status in firestore and local state
      await updateTaskStatus(draggableId, newStatus);
    } catch (error) {
      console.error('Failed to update task status:', error);
      setDragError('Failed to update task status. Please try again.');
    }
  };

  return (
    <div className="h-full">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-indigo-900">My Tasks</h2>
        <button
          onClick={() => setIsAddingTask(true)}
          className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          <Plus size={20} />
          <span>Add Task</span>
        </button>
      </div>
      
      {isAddingTask && (
        <div className="mb-6">
          <TaskForm onCancel={() => setIsAddingTask(false)} />
        </div>
      )}

      {dragError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {dragError}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 h-full ${isDragging ? 'cursor-grabbing' : ''}`}>
            {columns.map((column) => (
              <TaskColumn
                key={column.id}
                title={column.title}
                status={column.id}
                tasks={tasksByStatus[column.id] || []}
                isDragging={isDragging}
              />
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
};

export default KanbanBoard;