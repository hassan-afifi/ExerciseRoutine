import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api';
import { extractErrorMessage, unwrapItem } from '../../utils';

export function AdminCategoryEditPage() {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [name, setName] = useState('');

    const categoryQuery = useQuery({
        queryKey: ['admin-category', categoryId],
        queryFn: async () => {
            const response = await api.get(`/admin/categories/${categoryId}`);
            return unwrapItem(response);
        },
    });

    useEffect(() => {
        if (!categoryQuery.data) {
            return;
        }

        setName(categoryQuery.data.name ?? '');
    }, [categoryQuery.data]);

    const updateMutation = useMutation({
        mutationFn: async () => {
            await api.patch(`/admin/categories/${categoryId}`, { name });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
            queryClient.invalidateQueries({ queryKey: ['admin-category', categoryId] });
            navigate('/admin/categories');
        },
    });

    const errorMessage = updateMutation.isError
        ? extractErrorMessage(updateMutation.error, 'Could not update category.')
        : '';

    if (categoryQuery.isLoading) {
        return (
            <main className="px-[15px] lg:px-7 py-7 max-w-lg mx-auto w-full flex-1">
                <div className="alert bg-base-100 border border-base-300">
                    <span>Loading category...</span>
                </div>
            </main>
        );
    }

    if (categoryQuery.isError || !categoryQuery.data) {
        return (
            <main className="px-[15px] lg:px-7 py-7 max-w-lg mx-auto w-full flex-1">
                <div className="alert alert-error">
                    <span>Category not found.</span>
                </div>
            </main>
        );
    }

    const category = categoryQuery.data;

    return (
        <main className="px-[15px] lg:px-7 py-7 max-w-lg mx-auto w-full flex-1">
            <h1 className="text-2xl font-bold mb-7">Admin Edit Category</h1>

            <div className="card bg-base-100 shadow-md">
                <div className="card-body">
                    <p className="text-sm text-base-content/60 mb-4">Owner: {category.owner?.name ?? 'Unknown'}</p>

                    {errorMessage && (
                        <div className="alert alert-error mb-3">
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            updateMutation.mutate();
                        }}
                    >
                        <fieldset className="fieldset mb-[15px]">
                            <label className="fieldset-label" htmlFor="name">Category Name</label>
                            <input
                                id="name"
                                type="text"
                                className="input w-full"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                            />
                        </fieldset>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                className="btn bg-base-200 text-base-content border border-base-300 hover:bg-base-200"
                                onClick={() => navigate('/admin/categories')}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
