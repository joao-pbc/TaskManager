import { 
  addDoc, 
  collection, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  updateDoc, 
  where,
  arrayUnion,
  arrayRemove,
  getDoc
} from 'firebase/firestore';
import { db } from './config';
import { v4 as uuidv4 } from 'uuid';
import { Task, Activity } from '../types';

// Get all tasks for a user
export const getTasks = async (userId: string): Promise<Task[]> => {
  try {
    const tasksQuery = query(collection(db, 'tasks'), where('userId', '==', userId));
    const querySnapshot = await getDocs(tasksQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Omit<Task, 'id'>;
      return { ...data, id: doc.id } as Task;
    });
  } catch (error) {
    console.error("Error getting tasks: ", error);
    throw error;
  }
};

// Create a new task
export const createTask = async (task: Omit<Task, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...task,
      createdAt: new Date().toISOString(),
      activities: [] // Initialize with empty activities array
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating task: ", error);
    throw error;
  }
};

// Update a task
export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<void> => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    const taskDoc = await getDoc(taskRef);
    
    if (!taskDoc.exists()) {
      throw new Error(`Task with id ${taskId} not found in Firestore`);
    }

    await updateDoc(taskRef, updates);
  } catch (error) {
    console.error("Error updating task: ", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
  } catch (error) {
    console.error("Error deleting task: ", error);
    throw error;
  }
};

// Add an activity to a task
export const addActivity = async (taskId: string, activity: Omit<Activity, 'id'>): Promise<void> => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    const activityWithId = { ...activity, id: uuidv4() } as Activity;
    
    await updateDoc(taskRef, {
      activities: arrayUnion(activityWithId)
    });
  } catch (error) {
    console.error("Error adding activity: ", error);
    throw error;
  }
};

// Update an activity in a task
export const updateActivity = async (taskId: string, oldActivity: Activity, newActivity: Activity): Promise<void> => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    const taskDoc = await getDoc(taskRef);
    
    if (!taskDoc.exists()) {
      throw new Error("Task not found");
    }
    
    const taskData = taskDoc.data() as Task;
    const activities = taskData.activities || [];
    
    // Remove the old activity and add the updated one
    await updateDoc(taskRef, {
      activities: arrayRemove(oldActivity)
    });
    
    await updateDoc(taskRef, {
      activities: arrayUnion(newActivity)
    });
  } catch (error) {
    console.error("Error updating activity: ", error);
    throw error;
  }
};

// Complete an activity
export const completeActivity = async (taskId: string, activityId: string, isCompleted: boolean): Promise<void> => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    const taskDoc = await getDoc(taskRef);
    
    if (!taskDoc.exists()) {
      throw new Error("Task not found");
    }
    
    const taskData = taskDoc.data() as Task;
    const activities = [...(taskData.activities || [])];
    
    const activityIndex = activities.findIndex(a => a.id === activityId);
    if (activityIndex === -1) {
      throw new Error("Activity not found");
    }
    
    // Create a new activities array with the updated activity
    const updatedActivities = activities.map(activity => {
      if (activity.id === activityId) {
        return { ...activity, completed: isCompleted };
      }
      return activity;
    });
    
    // Update the task with the new activities array
    await updateDoc(taskRef, {
      activities: updatedActivities
    });
  } catch (error) {
    console.error("Error completing activity: ", error);
    throw error;
  }
};