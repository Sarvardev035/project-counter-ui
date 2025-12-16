// Mock API service
import type { User, Task, Project } from '../types';
import { mockUsers, mockProjects, mockTasks } from './mockData';

// Simulated delay for realistic API behavior
const API_DELAY = 300;

// In-memory storage (simulating database)
let tasks = [...mockTasks];
let projects = [...mockProjects];
let users = [...mockUsers];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Project APIs
export const projectApi = {
  getAll: async (): Promise<Project[]> => {
    await delay(API_DELAY);
    return projects;
  },

  getById: async (id: string): Promise<Project | null> => {
    await delay(API_DELAY);
    return projects.find(p => p.id === id) || null;
  },

  create: async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    await delay(API_DELAY);
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.push(newProject);
    return newProject;
  },

  update: async (id: string, updates: Partial<Project>): Promise<Project | null> => {
    await delay(API_DELAY);
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return projects[index];
  },

  delete: async (id: string): Promise<boolean> => {
    await delay(API_DELAY);
    projects = projects.filter(p => p.id !== id);
    tasks = tasks.filter(t => t.projectId !== id);
    return true;
  },
};

// Task APIs
export const taskApi = {
  getAll: async (): Promise<Task[]> => {
    await delay(API_DELAY);
    return tasks;
  },

  getByProjectId: async (projectId: string): Promise<Task[]> => {
    await delay(API_DELAY);
    return tasks.filter(t => t.projectId === projectId);
  },

  getById: async (id: string): Promise<Task | null> => {
    await delay(API_DELAY);
    return tasks.find(t => t.id === id) || null;
  },

  create: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    await delay(API_DELAY);
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    return newTask;
  },

  update: async (id: string, updates: Partial<Task>): Promise<Task | null> => {
    await delay(API_DELAY);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return tasks[index];
  },

  delete: async (id: string): Promise<boolean> => {
    await delay(API_DELAY);
    tasks = tasks.filter(t => t.id !== id);
    return true;
  },
};

// User APIs
export const userApi = {
  getAll: async (): Promise<User[]> => {
    await delay(API_DELAY);
    return users;
  },

  getById: async (id: string): Promise<User | null> => {
    await delay(API_DELAY);
    return users.find(u => u.id === id) || null;
  },

  create: async (user: Omit<User, 'id'>): Promise<User> => {
    await delay(API_DELAY);
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
    };
    users.push(newUser);
    return newUser;
  },

  update: async (id: string, updates: Partial<User>): Promise<User | null> => {
    await delay(API_DELAY);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates };
    return users[index];
  },
};
