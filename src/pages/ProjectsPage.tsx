// Projects list page
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project, Task } from '../types';
import { projectApi, taskApi } from '../services/api';
import { ProjectCard } from '../components/ProjectCard';
import { Header } from '../components/Header';
import { LoadingSkeleton } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { useNotification } from '../context/NotificationContext';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsData, tasksData] = await Promise.all([
          projectApi.getAll(),
          taskApi.getAll(),
        ]);
        setProjects(projectsData);
        setTasks(tasksData);
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Failed to load projects',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [addNotification]);

  const getTaskCount = (projectId: string) => {
    return tasks.filter(t => t.projectId === projectId).length;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!newProjectName.trim()) {
      newErrors.name = 'Project name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateProject = async () => {
    if (!validateForm()) return;
    
    setCreating(true);
    try {
      const newProject = await projectApi.create({
        name: newProjectName,
        description: newProjectDesc,
      });
      
      setProjects([...projects, newProject]);
      setNewProjectName('');
      setNewProjectDesc('');
      setShowCreateModal(false);
      setErrors({});
      
      addNotification({
        type: 'success',
        message: 'Project created successfully',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to create project',
      });
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Projects" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
          <LoadingSkeleton count={3} />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Projects" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="section-title">All Projects</h2>
            <p className="section-subtitle">Organize your work by projects</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary whitespace-nowrap"
          >
            + New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            icon="📁"
            title="No projects yet"
            description="Create your first project to get started"
            action={{
              label: '+ Create Project',
              onClick: () => setShowCreateModal(true),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                taskCount={getTaskCount(project.id)}
                onClick={() => navigate(`/projects/${project.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-scale-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Create New Project</h2>
            <p className="text-gray-600 text-sm mb-6">Add a new project to organize your tasks</p>
            
            <div className="space-y-4">
              {/* Project Name */}
              <div>
                <label className="label-text">
                  Project Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => {
                    setNewProjectName(e.target.value);
                    if (errors.name) setErrors({});
                  }}
                  placeholder="e.g., Website Redesign"
                  className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                  disabled={creating}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1 font-medium">{errors.name}</p>
                )}
              </div>

              {/* Project Description */}
              <div>
                <label className="label-text">Description (Optional)</label>
                <textarea
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Describe your project..."
                  rows={3}
                  className="input-field resize-none"
                  disabled={creating}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewProjectName('');
                  setNewProjectDesc('');
                  setErrors({});
                }}
                disabled={creating}
                className="btn-secondary flex-1 py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={creating}
                className="btn-primary flex-1 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? '⏳ Creating...' : '+ Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
