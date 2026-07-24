import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export function AppLayout() {
    const { isAuthenticated, isAdmin, logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;

    const initials = (user?.name ?? '')
        .split(' ')
        .filter(Boolean)
        .map((part) => part.slice(0, 1))
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const isAdminMode = isAdmin && pathname.startsWith('/admin');
    const isHomeActive = pathname === '/' || /^\/exercises\/\d+$/.test(pathname);
    const isMyExercisesActive = pathname === '/exercises/my' || /^\/exercises\/\d+\/edit$/.test(pathname);
    const isFavouritesActive = pathname.startsWith('/favourites');
    const isCategoriesActive = pathname.startsWith('/categories');
    const isAddExerciseActive = pathname === '/exercises/new';
    const isAdminUsersActive = pathname.startsWith('/admin/users');
    const isAdminExercisesActive = pathname.startsWith('/admin/exercises');
    const isAdminCategoriesActive = pathname.startsWith('/admin/categories');

    const menuLinkClass = (isActive) => (isActive ? 'menu-active font-medium' : '');

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col bg-base-200 text-base-content">
            {!isAuthenticated && (
                <nav className="navbar bg-base-100 shadow-md px-[15px] lg:px-7">
                    <div className="navbar-start">
                        <Link to="/" className="btn btn-ghost text-xl font-bold text-primary">ExerciseRoutine</Link>
                    </div>
                    <div className="navbar-end gap-2">
                        <Link to="/login" className="btn btn-outline btn-primary btn-sm">Login</Link>
                        <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                    </div>
                </nav>
            )}

            {isAuthenticated && (
                <nav className="navbar bg-base-100 shadow-md px-[15px] lg:px-7">
                    <div className="navbar-start">
                        <Link to="/" className="btn btn-ghost text-xl font-bold text-primary">ExerciseRoutine</Link>
                        {isAdmin && (
                            <Link to="/admin/users" className="btn btn-primary btn-sm ml-2">Admin</Link>
                        )}
                    </div>
                    <div className="navbar-center hidden lg:flex">
                        {isAdminMode ? (
                            <ul className="menu menu-horizontal gap-1">
                                <li><Link to="/admin/users" className={menuLinkClass(isAdminUsersActive)}>Manage Users</Link></li>
                                <li><Link to="/admin/exercises" className={menuLinkClass(isAdminExercisesActive)}>Manage Exercises</Link></li>
                                <li><Link to="/admin/categories" className={menuLinkClass(isAdminCategoriesActive)}>Manage Categories</Link></li>
                            </ul>
                        ) : (
                            <ul className="menu menu-horizontal gap-1">
                                <li><Link to="/" className={menuLinkClass(isHomeActive)}>Home</Link></li>
                                <li><Link to="/exercises/my" className={menuLinkClass(isMyExercisesActive)}>My Exercises</Link></li>
                                <li><Link to="/favourites" className={menuLinkClass(isFavouritesActive)}>Favourites</Link></li>
                                <li><Link to="/categories" className={menuLinkClass(isCategoriesActive)}>My Categories</Link></li>
                                <li><Link to="/exercises/new" className={menuLinkClass(isAddExerciseActive)}>+ Add Exercise</Link></li>
                            </ul>
                        )}
                    </div>
                    <div className="navbar-end">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar avatar-placeholder">
                                <div className="bg-primary text-base-content rounded-full w-10">
                                    <span className="text-lg">{initials || 'U'}</span>
                                </div>
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg mt-2">
                                <li className="menu-title"><span>{user?.name}</span></li>
                                {isAdminMode ? (
                                    <>
                                        <li><Link to="/admin/users">Manage Users</Link></li>
                                        <li><Link to="/admin/exercises">Manage Exercises</Link></li>
                                        <li><Link to="/admin/categories">Manage Categories</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Link to="/exercises/my">My Exercises</Link></li>
                                        <li><Link to="/favourites">Favourites</Link></li>
                                        <li><Link to="/categories">My Categories</Link></li>
                                        {isAdmin && <li><Link to="/admin/users">Admin</Link></li>}
                                    </>
                                )}
                                <li className="border-t border-base-300 mt-1 pt-1">
                                    <button type="button" className="w-full text-left text-error" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            )}

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="footer footer-center bg-base-100 text-base-content p-7 mt-[28px] border-t border-base-300">
                <p>Copyright &copy; {new Date().getFullYear()} ExerciseRoutine. All rights reserved.</p>
            </footer>
        </div>
    );
}
