import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';
import { unwrapCollection } from '../utils';

export function HomePage() {
    const { isAuthenticated, user } = useAuth();
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearch(searchInput.trim());
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchInput]);

    const sortedCategoryIds = useMemo(
        () => [...selectedCategoryIds].sort((a, b) => a - b),
        [selectedCategoryIds],
    );

    const categoriesQuery = useQuery({
        queryKey: ['public-categories'],
        queryFn: async () => {
            const response = await api.get('/categories/public');
            return unwrapCollection(response).items;
        },
    });

    const exercisesQuery = useQuery({
        queryKey: ['home-exercises', debouncedSearch, sortedCategoryIds.join(',')],
        placeholderData: (previousData) => previousData,
        queryFn: async () => {
            const response = await api.get('/exercises', {
                params: {
                    per_page: 200,
                    ...(debouncedSearch ? { search: debouncedSearch } : {}),
                    ...(sortedCategoryIds.length > 0
                        ? { categories: sortedCategoryIds.join(',') }
                        : {}),
                },
            });

            return unwrapCollection(response);
        },
    });

    const statsQuery = useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const response = await api.get('/dashboard');
            return response.data;
        },
        enabled: isAuthenticated,
    });

    const exercises = exercisesQuery.data?.items ?? [];
    const totalCount = exercisesQuery.data?.meta?.total ?? exercises.length;

    const toggleCategory = (categoryId) => {
        setSelectedCategoryIds((previous) => (
            previous.includes(categoryId)
                ? previous.filter((id) => id !== categoryId)
                : [...previous, categoryId]
        ));
    };

    return (
        <>
            {isAuthenticated && (
                <>
                    <section className="px-[15px] lg:px-7 py-7 max-w-7xl mx-auto w-full">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
                                <p className="text-base-content/60 mt-1">Your exercise library is now focused on single-movement entries.</p>
                            </div>
                            <Link to="/exercises/new" className="btn btn-primary">+ Add New Exercise</Link>
                        </div>
                    </section>

                    <section className="px-[15px] lg:px-7 max-w-7xl mx-auto w-full">
                        <div className="stats stats-vertical md:stats-horizontal shadow w-full bg-base-100">
                            <div className="stat">
                                <div className="stat-title">My Exercises</div>
                                <div className="stat-value text-primary">{statsQuery.data?.my_exercises_count ?? 0}</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">Favourites</div>
                                <div className="stat-value text-primary">{statsQuery.data?.favourites_count ?? 0}</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">My Categories</div>
                                <div className="stat-value text-primary">{statsQuery.data?.my_categories_count ?? 0}</div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            <div className="px-[15px] lg:px-7 py-7 max-w-7xl mx-auto w-full">
                <div className="flex flex-col gap-4">
                    <div className="flex w-full">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder="Search exercises by title..."
                            className="input input-bordered flex-1"
                        />
                    </div>
                    <div className="flex w-full flex-wrap items-center justify-start gap-x-[2.375rem] gap-y-3">
                        {(categoriesQuery.data ?? []).map((category) => (
                            <label key={category.id} className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-sm checkbox-primary"
                                    checked={selectedCategoryIds.includes(category.id)}
                                    onChange={() => toggleCategory(category.id)}
                                />
                                <span className="text-sm">{category.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <section className="px-[15px] lg:px-7 py-[15px] max-w-7xl mx-auto w-full flex-1">
                <h2 className="text-2xl font-bold mb-7">
                    Top Exercises <span>({totalCount})</span>
                </h2>
                {exercisesQuery.isFetching && !exercisesQuery.isLoading && (
                    <p className="text-sm text-base-content/60 mb-4">Updating results...</p>
                )}

                {exercisesQuery.isLoading ? (
                    <div className="alert bg-base-100 border border-base-300">
                        <span>Loading exercises...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                        {exercises.length > 0 ? (
                            exercises.map((exercise) => (
                                <Link
                                    key={exercise.id}
                                    to={`/exercises/${exercise.id}`}
                                    className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow"
                                >
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
                                        <p className="text-sm text-base-content/60 mt-1">{exercise.description}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full">
                                <div className="alert bg-base-100 border border-base-300">
                                    <span>No exercises found with the selected filters.</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </>
    );
}
