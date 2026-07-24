import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import { extractErrorMessage, unwrapCollection } from '../../utils';

export function AdminExercisesPage() {
    const queryClient = useQueryClient();

    const exercisesQuery = useQuery({
        queryKey: ['admin-exercises'],
        queryFn: async () => {
            const response = await api.get('/admin/exercises', { params: { per_page: 200 } });
            return unwrapCollection(response).items;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (exerciseId) => {
            await api.delete(`/admin/exercises/${exerciseId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-exercises'] });
            queryClient.invalidateQueries({ queryKey: ['home-exercises'] });
        },
    });

    const errorMessage = deleteMutation.isError
        ? extractErrorMessage(deleteMutation.error, 'Could not delete exercise.')
        : '';

    const exercises = exercisesQuery.data ?? [];

    return (
        <main className="px-[15px] lg:px-7 py-7 max-w-5xl mx-auto w-full flex-1">
            <h1 className="text-2xl font-bold mb-7">Manage Exercises</h1>

            {errorMessage && (
                <div className="alert alert-error mb-4">
                    <span>{errorMessage}</span>
                </div>
            )}

            <div className="card bg-base-100 shadow-md w-full">
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="table w-full admin-centered-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Owner</th>
                                    <th>Categories</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exercises.length > 0 ? (
                                    exercises.map((exercise) => (
                                        <tr key={exercise.id}>
                                            <td className="font-medium">{exercise.title}</td>
                                            <td>{exercise.owner?.name ?? 'Unknown'}</td>
                                            <td>{(exercise.categories ?? []).length}</td>
                                            <td>{formatDate(exercise.created_at)}</td>
                                            <td className="whitespace-nowrap">
                                                <Link to={`/exercises/${exercise.id}`} className="btn btn-ghost btn-xs">View</Link>
                                                <Link to={`/admin/exercises/${exercise.id}/edit`} className="btn btn-ghost btn-xs">Edit</Link>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-xs text-error"
                                                    onClick={() => deleteMutation.mutate(exercise.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center text-base-content/60">No exercises found.</td>
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

function formatDate(dateTimeString) {
    if (!dateTimeString) {
        return '';
    }

    return dateTimeString.slice(0, 10);
}
