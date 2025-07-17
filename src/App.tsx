// src/App.tsx
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import Layout from "./_components/Layout";
import TrainingsPage from "./pages/Trainings/TrainingsPage";
import ExercicesPage from "./pages/ExercicesPage/ExercicesPage";
import ProgramsPage from "./pages/ProgramsPage/ProgramsPage";
import StatisticsPage from "./pages/StatisticsPage/StatisticsPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/config/api/QueryClient.ts";
import { AuthProvider } from "@/contexts/AuthContext";
import AdministrationPage from "./pages/Administration/AdministrationPage";
import ProtectedRoute from "./router/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "trainings",
        element: <TrainingsPage />,
      },
      { path: "programs", element: <ProgramsPage /> },
      {
        path: "exercises",
        element: <ExercicesPage />,
      },
      { path: "statistics", element: <StatisticsPage /> },
      { path: "profile", element: <ProfilePage /> },
      {
        path: "administration",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <AdministrationPage />
          </ProtectedRoute>
        ),
      },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />;
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
