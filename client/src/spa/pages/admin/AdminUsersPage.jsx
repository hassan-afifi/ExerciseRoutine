import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import { extractErrorMessage, unwrapCollection } from '../../utils';

export function AdminUsersPage() {
    const queryClient = useQueryClient();

    const usersQuery = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const response = await api.get('/admin/users', { params: { per_page: 200 } });
            return unwrapCollection(response).items;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (userId) => {
            await api.delete(`/admin/users/${userId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
    });

    const errorMessage = deleteMutation.isError
        ? extractErrorMessage(deleteMutation.error, 'Could not delete user.')
        : '';

    const users = usersQuery.data ?? [];

    return (
        <main className="px-[15px] lg:px-7 py-7 max-w-5xl mx-auto w-full flex-1">
            <div className="flex items-center justify-between mb-7">
                <h1 className="text-2xl font-bold">User Management</h1>
                <span className="text-sm text-base-content/60">Admin only</span>
            </div>

            {errorMessage && (
                <div className="alert alert-error mb-4">
                    <span>{errorMessage}</span>
                </div>
            )}

            <div className="card bg-base-100 shadow-md w-full">
                <div className="card-body p-0">
                    <div className="overflow-x-auto overflow-y-auto max-h-[82vh]">
                        <table className="table w-full admin-centered-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th className="whitespace-nowrap min-w-[8rem]">Birth Date</th>
                                    <th>Role</th>
                                    <th>Exercises</th>
                                    <th>Categories</th>
                                    <th>Favourites</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((managedUser) => (
                                    <tr key={managedUser.id}>
                                        <td className="font-medium">{managedUser.name}</td>
                                        <td>{managedUser.email}</td>
                                        <td className="whitespace-nowrap min-w-[8rem]">{managedUser.birth_date ?? ''}</td>
                                        <td>
                                            <span className={`badge badge-sm ${managedUser.is_admin ? 'badge-primary' : 'badge-outline'}`}>
                                                {managedUser.is_admin ? 'Admin' : 'User'}
                                            </span>
                                        </td>
                                        <td>{managedUser.exercises_count ?? 0}</td>
                                        <td>{managedUser.categories_count ?? 0}</td>
                                        <td>{managedUser.favourite_exercises_count ?? 0}</td>
                                        <td className="whitespace-nowrap">
                                            <Link to={`/admin/users/${managedUser.id}/edit`} className="btn btn-ghost btn-xs">Edit</Link>
                                            <button
                                                type="button"
                                                className="btn btn-ghost btn-xs text-error"
                                                onClick={() => deleteMutation.mutate(managedUser.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
