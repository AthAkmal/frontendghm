import { createBrowserRouter, Navigate } from 'react-router';
import { Layout }        from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { ReportsPage }   from './pages/ReportsPage';
import { CommentsPage }  from './pages/CommentsPage';
import { SettingsPage }  from './pages/SettingsPage';
import { TutorialPage }  from './pages/TutorialPage'; // <-- 1. IMPORT HALAMAN TUTORIAL DI SINI

export const router = createBrowserRouter([
  {
    path:     '/',
    element:  <Layout />,
    children: [
      { index: true,         element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard',   element: <DashboardPage /> },
      { path: 'reports',     element: <ReportsPage />  },
      { path: 'comments',    element: <CommentsPage />  },
      { path: 'tutorial',    element: <TutorialPage />  }, // <-- 2. TAMBAHKAN RUTE BARU DI SINI
      { path: 'settings',    element: <SettingsPage />  },
    ],
  },
]);