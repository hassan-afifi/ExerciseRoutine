import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { extractErrorMessage, unwrapCollection } from '../utils';

export function MyExercisesPage() {
    const queryClient = useQueryClient();

    const myExercisesQuery = useQuery({
        queryKey: ['my-exercises'],
        queryFn: async () => {
            const response = await api.get('/exercises/my', { params: { per_page: 200 } });
            return unwrapCollection(response).items;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (exerciseId) => {
            await api.delete(`/exercises/${exerciseId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-exercises'] });
            queryClient.invalidateQueries({ queryKey: ['home-exercises'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });

    const errorMessage = deleteMutation.isError
        ? extractErrorMessage(deleteMutation.error, 'Could not delete exercise.')
        : '';

    const exercises = myExercisesQuery.data ?? [];

    return (
        <main className="px-[15px] lg:px-7 py-7 max-w-7xl mx-auto w-full flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
                <h1 className="text-2xl font-bold">My Exercises</h1>
                <Link to="/exercises/new" className="btn btn-primary btn-sm">+ Add New Exercise</Link>
            </div>

            {errorMessage && (
                <div className="alert alert-error mb-4">
                    <span>{errorMessage}</span>
                </div>
            )}

            {myExercisesQuery.isLoading ? (
                <div className="alert bg-base-100 border border-base-300">
                    <span>Loading exercises...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {exercises.length > 0 ? (
                        exercises.map((exercise) => (
                            <div key={exercise.id} className="card relative bg-base-100 shadow-md hover:shadow-xl transition-shadow">
                                <Link
                                    to={`/exercises/${exercise.id}`}
                                    className="absolute inset-0 z-10"
                                    aria-label={`View ${exercise.title}`}
                                />
                                <figure>
                                    {exercise.image_url ? (
                                        <img
                                            src={exercise.image_url}
                                            alt={exercise.title}
                                            className="w-full aspect-square object-cover"
                                        />
                                    ) : (
                                        <div className="w-full aspect-square bg-base-300" />
                                    )}
                                </figure>
                                <div className="card-body p-3">
                                    <h3 className="card-title text-sm">{exercise.title}</h3>
                                    <div className="flex gap-1 flex-wrap">
                                        {(exercise.categories ?? []).map((category) => (
                                            <span key={category.id} className="badge badge-sm category-badge">{category.name}</span>
                                        ))}
                                    </div>
                                    <div className="card-actions relative z-20 justify-end mt-2">
                                        <Link to={`/exercises/${exercise.id}/edit`} className="btn btn-outline btn-xs">Edit</Link>
                                        <button
                                            type="button"
                                            className="btn btn-outline btn-error btn-xs"
                                            onClick={() => deleteMutation.mutate(exercise.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <div className="alert bg-base-100 border border-base-300">
                                <span>You have not created any exercises yet.</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}
