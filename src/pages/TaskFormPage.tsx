// Task form page for creating and editing tasks
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Task, User } from '../types';
import { taskApi, userApi } from '../services/api';
import { Header } from '../components/Header';
import { UserSelector } from '../components/UserSelector';
import { LoadingSpinner } from '../components/Loading';
import { useNotification } from '../context/NotificationContext';

export const TaskFormPage: React.FC = () => {
  const { projectId, taskId } = useParams<{ projectId: string; taskId?: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(taskId ? true : false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    due_date: '',
    assignedUsers: [] as User[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const usersData = await userApi.getAll();
        setUsers(usersData);

        if (taskId) {
          const taskData = await taskApi.getById(taskId);
          if (taskData) {
            setFormData({
              title: taskData.title,
              description: taskData.description,
              status: taskData.status,
              priority: taskData.priority,
              due_date: taskData.due_date,
              assignedUsers: taskData.assignedUsers,
            });
          }
        }
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Failed to load data',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [taskId, addNotification]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!projectId) return;

    setSubmitting(true);

    try {
      if (taskId) {
        // Update existing task
        await taskApi.update(taskId, {
          ...formData,
        });
        addNotification({
          type: 'success',
          message: 'Task updated successfully',
        });
      } else {
        // Create new task
        await taskApi.create({
          ...formData,
          projectId,
        });
        addNotification({
          type: 'success',
          message: 'Task created successfully',
        });
      }

      navigate(`/projects/${projectId}`);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to save task',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Loading..." backButton />
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title={taskId ? 'Edit Task' : 'Create Task'} backButton />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
        <div className="card-elevated p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="label-text">
                Task Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={`input-field ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}`}
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-2 font-medium">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="label-text">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input-field resize-none"
                placeholder="Enter task description"
                rows={4}
              />
            </div>

            {/* Status */}
            <div>
              <label className="label-text">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as Task['status'] })
                }
                className="input-field"
              >
                <option value="todo">📋 Todo</option>
                <option value="in-progress">⏳ In Progress</option>
                <option value="done">✓ Done</option>
              </select>
            </div>

            {/* Priority and Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="label-text">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as Task['priority'],
                    })
                  }
                  className="input-field"
                >
                  <option value="low">⬇️ Low</option>
                  <option value="medium">→ Medium</option>
                  <option value="high">⬆️ High</option>
                </select>
              </div>

              <div>
                <label className="label-text">
                  Due Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) =>
                    setFormData({ ...formData, due_date: e.target.value })
                  }
                  className={`input-field ${errors.due_date ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}`}
                />
                {errors.due_date && (
                  <p className="text-red-600 text-sm mt-2 font-medium">{errors.due_date}</p>
                )}
              </div>
            </div>

            {/* User Assignment */}
            <div>
              <label className="label-text">Assign Users</label>
              <UserSelector
                users={users}
                selectedUsers={formData.assignedUsers}
                onChange={(selectedUsers) =>
                  setFormData({ ...formData, assignedUsers: selectedUsers })
                }
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`/projects/${projectId}`)}
                className="btn-secondary flex-1 py-2.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex-1 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '⏳ Saving...' : taskId ? '✓ Update Task' : '+ Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
