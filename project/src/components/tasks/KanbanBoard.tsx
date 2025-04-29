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
    
    // Adiciona classe no body para prevenir scroll
    document.body.style.overflow = 'hidden';
    document.body.style.userSelect = 'none';
  };

  // Handle drag end
  const handleDragEnd = async (result: DropResult) => {
    setIsDragging(false);
    
    // Remove as restrições de scroll
    document.body.style.overflow = '';
    document.body.style.userSelect = '';
    
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
      // Reordenar as tasks localmente antes de atualizar o status
      const updatedTasks = Array.from(tasks);
      const [movedTask] = updatedTasks.splice(source.index, 1);
      updatedTasks.splice(destination.index, 0, { ...movedTask, status: newStatus });
      
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <TaskColumn
              title="To Do"
              status="todo"
              tasks={tasksByStatus['todo'] || []}
            />
            <TaskColumn
              title="In Progress"
              status="in-progress"
              tasks={tasksByStatus['in-progress'] || []}
            />
            <TaskColumn
              title="Done"
              status="done"
              tasks={tasksByStatus['done'] || []}
            />
          </div>
        </DragDropContext>
      )}
    </div>
  );
};

export default KanbanBoard;