import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { extractErrorMessage, unwrapCollection } from '../utils';

export function CategoriesPage() {
    const queryClient = useQueryClient();
    const [newCategoryName, setNewCategoryName] = useState('');

    const categoriesQuery = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/categories');
            return unwrapCollection(response).items;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (name) => {
            await api.post('/categories', { name });
        },
        onSuccess: () => {
            setNewCategoryName('');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['public-categories'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/categories/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['public-categories'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });

    const errorMessage = createMutation.isError
        ? extractErrorMessage(createMutation.error, 'Could not create category.')
        : (deleteMutation.isError
            ? extractErrorMessage(deleteMutation.error, 'Could not delete category.')
            : '');

    const categories = categoriesQuery.data ?? [];

    return (
        <main className="px-[15px] lg:px-7 py-7 max-w-[800px] mx-auto w-full flex-1">
            <h1 className="text-2xl font-bold mb-7">My Categories</h1>

            {errorMessage && (
                <div className="alert alert-error mb-4">
                    <span>{errorMessage}</span>
                </div>
            )}

            <div className="card bg-base-100 shadow-md mb-7">
                <div className="card-body p-[15px]">
                    <h2 className="font-semibold mb-3">Add New Category</h2>
                    <form
                        className="flex gap-2"
                        onSubmit={(event) => {
                            event.preventDefault();
                            if (!newCategoryName.trim()) {
                                return;
                            }

                            createMutation.mutate(newCategoryName.trim());
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Category name"
                            className="input input-sm flex-1"
                            value={newCategoryName}
                            onChange={(event) => setNewCategoryName(event.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary btn-sm">Add</button>
                    </form>
                </div>
            </div>

            <div className="card bg-base-100 shadow-md">
                <div className="card-body p-0">
                    <table className="table w-full admin-centered-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Exercises</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <tr key={category.id}>
                                        <td className="font-medium">{category.name}</td>
                                        <td>{category.exercises_count ?? 0}</td>
                                        <td>
                                            <Link to={`/categories/${category.id}/edit`} className="btn btn-ghost btn-xs">Edit</Link>
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
                                    <td colSpan={3} className="text-center text-base-content/60">No categories yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
