import React, { useState } from 'react';
import { Task } from '../../types';
import { Trash, Plus, ChevronDown, ChevronUp, Circle, CheckCircle } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [showActivities, setShowActivities] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  const { deleteTask, addActivity, toggleActivityCompletion } = useTasks();

  // Calculate progress percentage
  const calculateProgress = () => {
    if (task.activities.length === 0) return 0;
    const completedCount = task.activities.filter(a => a.completed).length;
    return Math.round((completedCount / task.activities.length) * 100);
  };

  const progress = calculateProgress();

  // Handle add activity form submission
  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.trim()) return;
    
    addActivity(task.id, newActivity.trim());
    setNewActivity('');
  };

  // Handle activity toggle
  const handleToggleActivity = (activityId: string, completed: boolean) => {
    toggleActivityCompletion(task.id, activityId, !completed);
  };

  // Handle delete task
  const handleDeleteTask = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  return (
    <div className="bg-white rounded-md shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-gray-800">{task.title}</h4>
        <button
          onClick={handleDeleteTask}
          className="text-red-500 hover:text-red-700 p-1"
          aria-label="Delete task"
        >
          <Trash size={16} />
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mt-1 mb-2">{task.description}</p>
      
      {/* Progress bar */}
      {task.activities.length > 0 && (
        <div className="mt-3 mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Activities section */}
      <div className="mt-3">
        <button
          onClick={() => setShowActivities(!showActivities)}
          className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-800"
        >
          {showActivities ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span>Activities ({task.activities.length})</span>
        </button>
        
        {showActivities && (
          <div className="mt-2">
            {task.activities.length > 0 && (
              <ul className="space-y-2 mb-3">
                {task.activities.map(activity => (
                  <li key={activity.id} className="flex items-start space-x-2">
                    <button
                      onClick={() => handleToggleActivity(activity.id, activity.completed)}
                      className={`mt-0.5 ${activity.completed ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      {activity.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                    </button>
                    <span className={`text-sm ${activity.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {activity.title}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            
            <form onSubmit={handleAddActivity} className="flex items-center mt-2">
              <input
                type="text"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="Add activity..."
                className="flex-grow text-sm border border-gray-300 rounded-l-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-2 py-1 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <Plus size={16} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;