import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api';
import { extractErrorMessage, unwrapCollection, unwrapItem } from '../../utils';

const MUSCLE_OPTIONS = ['Back', 'Biceps', 'Cardio', 'Chest', 'Core', 'Forearms', 'Full Body', 'Legs', 'Neck', 'Shoulders', 'Triceps'];
const EQUIPMENT_OPTIONS = ['Barbell', 'Body Weight', 'Bosu Ball', 'Cable', 'Dumbbell', 'Hammer', 'Kettlebell', 'Leverage Machine', 'Medicine Ball', 'Resistance Band', 'Roll', 'Rope', 'Sled Machine', 'Smith Machine', 'Stability Ball', 'Suspension', 'Trap Bar', 'Wheel Roller'];

const initialFormState = {
    title: '',
    description: '',
    instructions: '',
    difficulty: 'easy',
    muscle: MUSCLE_OPTIONS[0],
    equipment: EQUIPMENT_OPTIONS[0],
};

export function AdminExerciseEditPage() {
    const { exerciseId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [formState, setFormState] = useState(initialFormState);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const categoriesQuery = useQuery({
        queryKey: ['public-categories'],
        queryFn: async () => {
            const response = await api.get('/categories/public');
            return unwrapCollection(response).items;
        },
    });

    const exerciseQuery = useQuery({
        queryKey: ['admin-exercise', exerciseId],
        queryFn: async () => {
            const response = await api.get(`/admin/exercises/${exerciseId}`);
            return unwrapItem(response);
        },
    });

    useEffect(() => {
        if (!exerciseQuery.data) {
            return;
        }

        setFormState({
            title: exerciseQuery.data.title ?? '',
            description: exerciseQuery.data.description ?? '',
            instructions: exerciseQuery.data.instructions ?? '',
            difficulty: exerciseQuery.data.difficulty ?? 'easy',
            muscle: exerciseQuery.data.muscle ?? MUSCLE_OPTIONS[0],
            equipment: exerciseQuery.data.equipment ?? EQUIPMENT_OPTIONS[0],
        });
        setSelectedCategories((exerciseQuery.data.categories ?? []).map((category) => category.id));
    }, [exerciseQuery.data]);

    const saveMutation = useMutation({
        mutationFn: async () => {
            const payload = new FormData();
            payload.append('title', formState.title);
            payload.append('description', formState.description);
            payload.append('instructions', formState.instructions);
            payload.append('difficulty', formState.difficulty);
            payload.append('muscle', formState.muscle);
            payload.append('equipment', formState.equipment);
            selectedCategories.forEach((categoryId, index) => {
                payload.append(`categories[${index}]`, String(categoryId));
            });

            if (selectedImage) {
                payload.append('image', selectedImage);
            }

            await api.post(`/admin/exercises/${exerciseId}?_method=PATCH`, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-exercises'] });
            queryClient.invalidateQueries({ queryKey: ['admin-exercise', exerciseId] });
            queryClient.invalidateQueries({ queryKey: ['exercise', exerciseId] });
            navigate('/admin/exercises');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            await api.delete(`/admin/exercises/${exerciseId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-exercises'] });
            queryClient.invalidateQueries({ queryKey: ['home-exercises'] });
            navigate('/admin/exercises');
        },
    });

    const errorMessage = saveMutation.isError
        ? extractErrorMessage(saveMutation.error, 'Could not update exercise.')
        : (deleteMutation.isError
            ? extractErrorMessage(deleteMutation.error, 'Could not delete exercise.')
            : '');

    if (categoriesQuery.isLoading || exerciseQuery.isLoading) {
        return (
            <main className="px-[15px] lg:px-7 py-7 max-w-[800px] mx-auto w-full flex-1">
                <div className="alert bg-base-100 border border-base-300">
                    <span>Loading exercise...</span>
                </div>
            </main>
        );
    }

    if (exerciseQuery.isError || !exerciseQuery.data) {
        return (
            <main className="px-[15px] lg:px-7 py-7 max-w-[800px] mx-auto w-full flex-1">
                <div className="alert alert-error">
                    <span>Exercise not found.</span>
                </div>
            </main>
        );
    }

    const categories = categoriesQuery.data ?? [];
    const exercise = exerciseQuery.data;

    return (
        <main className="px-[15px] lg:px-7 py-7 max-w-[800px] mx-auto w-full flex-1">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-2xl font-bold">Admin Edit Exercise</h1>
                    <span className="text-sm text-base-content/60">Owner: {exercise.owner?.name ?? 'Unknown'}</span>
                </div>
                <button
                    type="button"
                    className="btn btn-error btn-outline btn-sm"
                    onClick={() => deleteMutation.mutate()}
                >
                    Delete Exercise
                </button>
            </div>

            {errorMessage && (
                <div className="alert alert-error mb-4 mt-5">
                    <span>{errorMessage}</span>
                </div>
            )}

            <form
                className="space-y-7 mt-5"
                onSubmit={(event) => {
                    event.preventDefault();
                    saveMutation.mutate();
                }}
            >
                <fieldset className="fieldset">
                    <label className="fieldset-label" htmlFor="title">Title</label>
                    <input
                        id="title"
                        type="text"
                        className="input w-full"
                        value={formState.title}
                        onChange={(event) => setFormState((previous) => ({ ...previous, title: event.target.value }))}
                        required
                    />
                </fieldset>

                <fieldset className="fieldset">
                    <label className="fieldset-label" htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        className="textarea h-28 w-full"
                        value={formState.description}
                        onChange={(event) => setFormState((previous) => ({ ...previous, description: event.target.value }))}
                        required
                    />
                </fieldset>

                <fieldset className="fieldset">
                    <label className="fieldset-label">Image</label>
                    <input
                        type="file"
                        className="file-input w-full"
                        onChange={(event) => setSelectedImage(event.target.files?.[0] ?? null)}
                    />
                </fieldset>

                <fieldset className="fieldset">
                    <label className="fieldset-label">Categories</label>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-sm checkbox-primary"
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => {
                                        setSelectedCategories((previous) => (
                                            previous.includes(category.id)
                                                ? previous.filter((id) => id !== category.id)
                                                : [...previous, category.id]
                                        ));
                                    }}
                                />
                                <span className="text-sm">{category.name}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <fieldset className="fieldset">
                        <label className="fieldset-label" htmlFor="difficulty">Difficulty</label>
                        <select
                            id="difficulty"
                            className="select w-full"
                            value={formState.difficulty}
                            onChange={(event) => setFormState((previous) => ({ ...previous, difficulty: event.target.value }))}
                            required
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </fieldset>

                    <fieldset className="fieldset">
                        <label className="fieldset-label" htmlFor="muscle">Muscle</label>
                        <select
                            id="muscle"
                            className="select w-full"
                            value={formState.muscle}
                            onChange={(event) => setFormState((previous) => ({ ...previous, muscle: event.target.value }))}
                            required
                        >
                            {MUSCLE_OPTIONS.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </fieldset>

                    <fieldset className="fieldset">
                        <label className="fieldset-label" htmlFor="equipment">Equipment</label>
                        <select
                            id="equipment"
                            className="select w-full"
                            value={formState.equipment}
                            onChange={(event) => setFormState((previous) => ({ ...previous, equipment: event.target.value }))}
                            required
                        >
                            {EQUIPMENT_OPTIONS.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </fieldset>
                </div>

                <fieldset className="fieldset">
                    <label className="fieldset-label" htmlFor="instructions">Instructions</label>
                    <textarea
                        id="instructions"
                        className="textarea h-48 w-full"
                        value={formState.instructions}
                        onChange={(event) => setFormState((previous) => ({ ...previous, instructions: event.target.value }))}
                        required
                    />
                </fieldset>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        className="btn bg-base-100 text-base-content border border-base-300 hover:bg-base-100"
                        onClick={() => navigate('/admin/exercises')}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
            </form>
        </main>
    );
}
