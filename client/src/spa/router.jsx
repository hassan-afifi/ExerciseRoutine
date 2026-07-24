import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './auth';
import { AppLayout } from './components/AppLayout';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryEditPage } from './pages/CategoryEditPage';
import { ExerciseDetailPage } from './pages/ExerciseDetailPage';
import { ExerciseFormPage } from './pages/ExerciseFormPage';
import { FavouritesPage } from './pages/FavouritesPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MyExercisesPage } from './pages/MyExercisesPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminCategoryEditPage } from './pages/admin/AdminCategoryEditPage';
import { AdminExerciseEditPage } from './pages/admin/AdminExerciseEditPage';
import { AdminExercisesPage } from './pages/admin/AdminExercisesPage';
import { AdminUserEditPage } from './pages/admin/AdminUserEditPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';

export function AppRouter() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/exercises/:exerciseId" element={<ExerciseDetailPage />} />
                <Route path="/login" element={<GuestOnlyRoute><LoginPage /></GuestOnlyRoute>} />
                <Route path="/register" element={<GuestOnlyRoute><RegisterPage /></GuestOnlyRoute>} />

                <Route path="/dashboard" element={<Navigate to="/" replace />} />
                <Route path="/exercises/my" element={<ProtectedRoute><MyExercisesPage /></ProtectedRoute>} />
                <Route path="/favourites" element={<ProtectedRoute><FavouritesPage /></ProtectedRoute>} />
                <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
                <Route path="/categories/:categoryId/edit" element={<ProtectedRoute><CategoryEditPage /></ProtectedRoute>} />
                <Route path="/exercises/new" element={<ProtectedRoute><ExerciseFormPage /></ProtectedRoute>} />
                <Route path="/exercises/:exerciseId/edit" element={<ProtectedRoute><ExerciseFormPage /></ProtectedRoute>} />

                <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
                <Route path="/admin/users/:userId/edit" element={<AdminRoute><AdminUserEditPage /></AdminRoute>} />
                <Route path="/admin/exercises" element={<AdminRoute><AdminExercisesPage /></AdminRoute>} />
                <Route path="/admin/exercises/:exerciseId/edit" element={<AdminRoute><AdminExerciseEditPage /></AdminRoute>} />
                <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
                <Route path="/admin/categories/:categoryId/edit" element={<AdminRoute><AdminCategoryEditPage /></AdminRoute>} />

                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}

function ProtectedRoute({ children }) {
    const location = useLocation();
    const { isLoading, isAuthenticated } = useAuth();

    if (isLoading) {
        return <LoadingPage />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}

function GuestOnlyRoute({ children }) {
    const { isLoading, isAuthenticated } = useAuth();
    if (isLoading) {
        return <LoadingPage />;
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function AdminRoute({ children }) {
    const location = useLocation();
    const { isLoading, isAuthenticated, isAdmin } = useAuth();

    if (isLoading) {
        return <LoadingPage />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function LoadingPage() {
    return <div className="max-w-7xl mx-auto p-8">Loading...</div>;
}

function NotFoundPage() {
    return <div className="max-w-7xl mx-auto p-8">Page not found.</div>;
}
