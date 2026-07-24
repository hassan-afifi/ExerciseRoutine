import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';
import { extractErrorMessage, unwrapItem } from '../utils';

export function ExerciseDetailPage() {
    const { exerciseId } = useParams();
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    const exerciseQuery = useQuery({
        queryKey: ['exercise', exerciseId],
        queryFn: async () => {
            const response = await api.get(`/exercises/${exerciseId}`);
            return unwrapItem(response);
        },
    });

    const favouriteMutation = useMutation({
        mutationFn: async (exercise) => {
            if (exercise.is_favourite) {
                await api.delete(`/exercises/${exercise.id}/favourite`);
                return false;
            }

            await api.post(`/exercises/${exercise.id}/favourite`);
            return true;
        },
        onSuccess: (nextValue) => {
            queryClient.setQueryData(['exercise', exerciseId], (previous) => ({
                ...previous,
                is_favourite: nextValue,
            }));
            queryClient.invalidateQueries({ queryKey: ['favourites'] });
            queryClient.invalidateQueries({ queryKey: ['home-exercises'] });
            queryClient.invalidateQueries({ queryKey: ['my-exercises'] });
        },
    });

    if (exerciseQuery.isLoading) {
        return (
            <div className="px-[15px] lg:px-7 py-[15px] max-w-[800px] mx-auto w-full">
                <div className="alert bg-base-100 border border-base-300">
                    <span>Loading exercise...</span>
                </div>
            </div>
        );
    }

    if (exerciseQuery.isError || !exerciseQuery.data) {
        return (
            <div className="px-[15px] lg:px-7 py-[15px] max-w-[800px] mx-auto w-full">
                <div className="alert alert-error">
                    <span>Exercise not found.</span>
                </div>
            </div>
        );
    }

    const exercise = exerciseQuery.data;
    const favouriteError = favouriteMutation.isError
        ? extractErrorMessage(favouriteMutation.error, 'Could not update favourite state.')
        : '';
    const instructionLines = String(exercise.instructions ?? '')
        .split(/\r\n|\r|\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    return (
        <>
            <div className="px-[15px] lg:px-7 py-[15px] max-w-[800px] mx-auto w-full">
                <div className="breadcrumbs text-sm">
                    <ul>
                        <li><Link to="/">Exercises</Link></li>
                        <li className="text-base-content/60">{exercise.title}</li>
                    </ul>
                </div>
            </div>

            <main className="px-[15px] lg:px-7 max-w-[800px] mx-auto w-full flex-1 pb-12">
                <figure className="rounded-xl overflow-hidden mb-7 shadow-lg max-w-full mx-auto">
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

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
                    <div>
                        <h1 className="text-3xl font-bold mb-3">{exercise.title}</h1>
                        <div className="flex gap-2 flex-wrap">
                            {(exercise.categories ?? []).map((category) => (
                                <span key={category.id} className="badge category-badge">{category.name}</span>
                            ))}
                            <span className="badge badge-outline">{capitalize(exercise.difficulty)}</span>
                            <span className="badge badge-outline">{exercise.muscle}</span>
                            <span className="badge badge-outline">{exercise.equipment}</span>
                        </div>
                    </div>

                    {isAuthenticated ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button
                                type="button"
                                className={exercise.is_favourite ? 'btn btn-outline btn-error' : 'btn btn-outline btn-primary'}
                                onClick={() => favouriteMutation.mutate(exercise)}
                            >
                                {exercise.is_favourite ? 'Unfavourite' : 'Add to Favourites'}
                            </button>
                        </div>
                    ) : (
                        <div>
                            <button className="btn btn-outline btn-sm" disabled title="Login to add to favourites">Add to Favourites</button>
                            <p className="text-xs text-base-content/50 mt-1">Login to save exercises</p>
                        </div>
                    )}
                </div>

                {favouriteError && (
                    <div className="alert alert-error mb-4">
                        <span>{favouriteError}</span>
                    </div>
                )}

                <p className="text-base-content/70 text-lg leading-relaxed mb-7">{exercise.description}</p>

                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title text-lg mb-[15px]">Instructions</h2>
                        <ol className="space-y-4 list-decimal list-inside text-sm">
                            {instructionLines.map((line) => (
                                <li key={line}>{line}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </main>
        </>
    );
}

function capitalize(value) {
    if (!value) {
        return '';
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
}
