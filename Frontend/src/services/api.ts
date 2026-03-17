import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalTasks: number;
  tasksPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: PaginationInfo;
}

// Auth API
export const authAPI = {
  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Tasks API
export const tasksAPI = {
  getTasks: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<TasksResponse> => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  getTask: async (id: string): Promise<{ task: Task }> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: {
    title: string;
    description: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  }) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  updateTask: async (
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    }
  ) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default api;