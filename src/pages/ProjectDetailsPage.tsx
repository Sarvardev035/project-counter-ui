// Project details/tasks page
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Project, Task } from '../types';
import { projectApi, taskApi } from '../services/api';
import { TaskCard } from '../components/TaskCard';
import { Header } from '../components/Header';
import { LoadingSkeleton } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { useNotification } from '../context/NotificationContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [statusFilter, setStatusFilter] = useLocalStorage<Task['status'] | 'all'>(
    `filter_status_${projectId}`,
    'all'
  );
  const [priorityFilter, setPriorityFilter] = useLocalStorage<Task['priority'] | 'all'>(
    `filter_priority_${projectId}`,
    'all'
  );
  const [sortBy, setSortBy] = useLocalStorage<'due_date' | 'priority'>(
    `sort_by_${projectId}`,
    'due_date'
  );

  useEffect(() => {
    const loadData = async () => {
      if (!projectId) return;
      try {
        const [projectData, tasksData] = await Promise.all([
          projectApi.getById(projectId),
          taskApi.getByProjectId(projectId),
        ]);

        if (!projectData) {
          addNotification({ type: 'error', message: 'Project not found' });
          navigate('/');
          return;
        }

        setProject(projectData);
        setTasks(tasksData);
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Failed to load project details',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId, navigate, addNotification]);

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      const updated = await taskApi.update(taskId, { status: newStatus });
      if (updated) {
        setTasks(tasks.map(t => (t.id === taskId ? updated : t)));
        addNotification({
          type: 'success',
          message: 'Task status updated',
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to update task',
      });
    }
  };

  const handleEditTask = (taskId: string) => {
    navigate(`/projects/${projectId}/tasks/${taskId}/edit`);
  };

  // Apply filters
  let filteredTasks = tasks.filter(task => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    return true;
  });

  // Apply sorting
  filteredTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'due_date') {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    const priorityOrder = { low: 0, medium: 1, high: 2 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  if (loading) {
    return (
      <>
        <Header title={project?.name || 'Loading...'} backButton />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <LoadingSkeleton count={4} />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title={project?.name} backButton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
        {/* Filters */}
        <div className="card-elevated p-5 sm:p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6">Filters & Sorting</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="label-text">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="input-field"
              >
                <option value="all">All Statuses</option>
                <option value="todo">📋 Todo</option>
                <option value="in-progress">⏳ In Progress</option>
                <option value="done">✓ Done</option>
              </select>
            </div>

            <div>
              <label className="label-text">Filter by Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="input-field"
              >
                <option value="all">All Priorities</option>
                <option value="low">⬇️ Low</option>
                <option value="medium">→ Medium</option>
                <option value="high">⬆️ High</option>
              </select>
            </div>

            <div>
              <label className="label-text">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="input-field"
              >
                <option value="due_date">📅 Due Date</option>
                <option value="priority">⚡ Priority</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <button
                onClick={() => navigate(`/projects/${projectId}/tasks/new`)}
                className="btn-primary w-full"
              >
                + New Task
              </button>
            </div>
          </div>
        </div>

        {/* Tasks */}
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon="✨"
            title="No tasks found"
            description={
              tasks.length === 0
                ? 'Create your first task to get started'
                : 'No tasks match your filters'
            }
            action={{
              label: '+ Create Task',
              onClick: () => navigate(`/projects/${projectId}/tasks/new`),
            }}
          />
        ) : (
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => handleEditTask(task.id)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        <div className="text-center text-sm text-gray-500 mt-8">
          Showing <span className="font-bold text-gray-700">{filteredTasks.length}</span> of{' '}
          <span className="font-bold text-gray-700">{tasks.length}</span> tasks
        </div>
      </div>
    </>
  );
};
