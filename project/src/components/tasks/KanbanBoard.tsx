import React, { useState } from 'react';
import { TaskStatus } from '../../types';
import TaskColumn from './TaskColumn';
import TaskForm from './TaskForm';
import { Plus } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

const KanbanBoard: React.FC = () => {
  const { tasks, loading, updateTaskStatus } = useTasks();
  const [isAddingTask, setIsAddingTask] = useState(false);

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

  // Handle drag end
  const handleDragEnd = async (result: any) => {
    const { draggableId, destination } = result;
    
    // If dropped outside a droppable area
    if (!destination) return;
    
    const newStatus = destination.droppableId as TaskStatus;
    
    // Update task status in firestore and local state
    await updateTaskStatus(draggableId, newStatus);
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
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              title={column.title}
              status={column.id}
              tasks={tasksByStatus[column.id] || []}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;