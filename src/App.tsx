import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { NotificationContainer } from './components/Notification';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { TaskFormPage } from './pages/TaskFormPage';
import './App.css';

function AppContent() {
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
        <Route path="/projects/:projectId/tasks/new" element={<TaskFormPage />} />
        <Route path="/projects/:projectId/tasks/:taskId/edit" element={<TaskFormPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </>
  );
}

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
