import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { TaskContextType, Task, TaskStatus } from '../types';
import { useAuth } from './AuthContext';
import * as firestore from '../firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Create context with default values
const TaskContext = createContext<TaskContextType>({
  tasks: [],
  loading: false,
  error: null,
  fetchTasks: async () => {},
  addTask: async () => {},
  updateTaskStatus: async () => {},
  deleteTask: async () => {},
  addActivity: async () => {},
  toggleActivityCompletion: async () => {}
});

// Task Provider component
export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Fetch tasks when user changes
  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [currentUser]);

  // Fetch all tasks for the current user
  const fetchTasks = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    try {
      const userTasks = await firestore.getTasks(currentUser.uid);
      setTasks(userTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'activities'>) => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    try {
      const newTaskId = await firestore.createTask({
        ...taskData,
        userId: currentUser.uid,
        activities: [],
        createdAt: new Date().toISOString()
      });
      
      // Add the new task to the local state
      setTasks(prev => [
        ...prev,
        {
          id: newTaskId,
          ...taskData,
          userId: currentUser.uid,
          activities: [],
          createdAt: new Date().toISOString()
        }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update a task's status
  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    setLoading(true);
    setError(null);
    try {
      await firestore.updateTask(taskId, { status });
      
      // Update the task in local state
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, status } : task
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string) => {
    setLoading(true);
    setError(null);
    try {
      await firestore.deleteTask(taskId);
      
      // Remove the task from local state
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add an activity to a task
  const addActivity = async (taskId: string, activityTitle: string) => {
    setLoading(true);
    setError(null);
    try {
      const newActivity = {
        title: activityTitle,
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      await firestore.addActivity(taskId, newActivity);
      
      // Add the activity to the task in local state
      setTasks(prev => 
        prev.map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              activities: [
                ...task.activities,
                { ...newActivity, id: uuidv4() }
              ]
            };
          }
          return task;
        })
      );
      
      // Refresh tasks to ensure we have the latest data
      fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add activity');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle activity completion
  const toggleActivityCompletion = async (taskId: string, activityId: string, isCompleted: boolean) => {
    setLoading(true);
    setError(null);
    try {
      await firestore.completeActivity(taskId, activityId, isCompleted);
      
      // Update the activity in local state
      setTasks(prev => 
        prev.map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              activities: task.activities.map(activity => 
                activity.id === activityId 
                  ? { ...activity, completed: isCompleted } 
                  : activity
              )
            };
          }
          return task;
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update activity');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTaskStatus,
    deleteTask,
    addActivity,
    toggleActivityCompletion
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// Custom hook to use task context
export const useTasks = () => useContext(TaskContext);