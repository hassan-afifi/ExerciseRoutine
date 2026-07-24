import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import { extractErrorMessage, unwrapCollection } from '../../utils';

export function AdminCategoriesPage() {
    const queryClient = useQueryClient();

    const categoriesQuery = useQuery({
        queryKey: ['admin-categories'],
        queryFn: async () => {
            const response = await api.get('/admin/categories', { params: { per_page: 200 } });
            return unwrapCollection(response).items;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (categoryId) => {
            await api.delete(`/admin/categories/${categoryId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
            queryClient.invalidateQueries({ queryKey: ['public-categories'] });
        },
    });

    const errorMessage = deleteMutation.isError
        ? extractErrorMessage(deleteMutation.error, 'Could not delete category.')
        : '';

    const categories = categoriesQuery.data ?? [];

    return (
        <main className="px-[15px] lg:px-7 py-7 max-w-5xl mx-auto w-full flex-1">
            <h1 className="text-2xl font-bold mb-7">Manage Categories</h1>

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
                                    <th>Owner</th>
                                    <th>Exercises</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <tr key={category.id}>
                                            <td className="font-medium">{category.name}</td>
                                            <td>{category.owner?.name ?? 'Unknown'}</td>
                                            <td>{category.exercises_count ?? 0}</td>
                                            <td className="whitespace-nowrap">
                                                <Link to={`/admin/categories/${category.id}/edit`} className="btn btn-ghost btn-xs">Edit</Link>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-xs text-error"
                                                    onClick={() => deleteMutation.mutate(category.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center text-base-content/60">No categories found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
