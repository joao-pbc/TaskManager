export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Activity {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
  activities: Activity[];
  createdAt: string;
}

export interface User {
  uid: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'activities'>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  addActivity: (taskId: string, activityTitle: string) => Promise<void>;
  toggleActivityCompletion: (taskId: string, activityId: string, isCompleted: boolean) => Promise<void>;
}