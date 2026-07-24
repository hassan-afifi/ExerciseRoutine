import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { extractErrorMessage, unwrapCollection } from '../utils';

export function FavouritesPage() {
    const queryClient = useQueryClient();

    const favouritesQuery = useQuery({
        queryKey: ['favourites'],
        queryFn: async () => {
            const response = await api.get('/favourites', { params: { per_page: 200 } });
            return unwrapCollection(response).items;
        },
    });

    const unfavouriteMutation = useMutation({
        mutationFn: async (exerciseId) => {
            await api.delete(`/exercises/${exerciseId}/favourite`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favourites'] });
            queryClient.invalidateQueries({ queryKey: ['home-exercises'] });
            queryClient.invalidateQueries({ queryKey: ['my-exercises'] });
        },
    });

    const errorMessage = unfavouriteMutation.isError
        ? extractErrorMessage(unfavouriteMutation.error, 'Could not unfavourite exercise.')
        : '';

    const exercises = favouritesQuery.data ?? [];

    return (
        <main className="px-[15px] lg:px-7 py-7 max-w-7xl mx-auto w-full flex-1">
            <div className="mb-7">
                <h1 className="text-2xl font-bold">Favourite Exercises</h1>
                <p className="text-base-content/60 mt-1">Showing {exercises.length} favourite exercises.</p>
            </div>

            {errorMessage && (
                <div className="alert alert-error mb-4">
                    <span>{errorMessage}</span>
                </div>
            )}

            {favouritesQuery.isLoading ? (
                <div className="alert bg-base-100 border border-base-300">
                    <span>Loading favourite exercises...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
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
                                <div className="card-body p-[15px]">
                                    <h3 className="card-title text-base">{exercise.title}</h3>
                                    <div className="flex gap-1 flex-wrap">
                                        {(exercise.categories ?? []).map((category) => (
                                            <span key={category.id} className="badge badge-sm category-badge">{category.name}</span>
                                        ))}
                                    </div>
                                    <div className="card-actions relative z-20 justify-end items-center mt-2">
                                        <button
                                            type="button"
                                            className="btn btn-outline btn-error btn-sm"
                                            onClick={() => unfavouriteMutation.mutate(exercise.id)}
                                        >
                                            Unfavourite
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <div className="alert bg-base-100 border border-base-300">
                                <span>No favourites yet. Open any exercise and click "Add to Favourites".</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}
