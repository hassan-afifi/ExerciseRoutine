import { useMemo, useState } from 'react';

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const MUSCLE_OPTIONS = [
    'Back',
    'Biceps',
    'Cardio',
    'Chest',
    'Core',
    'Forearms',
    'Full Body',
    'Legs',
    'Neck',
    'Shoulders',
    'Triceps',
];
const EQUIPMENT_OPTIONS = [
    'Barbell',
    'Body Weight',
    'Bosu Ball',
    'Cable',
    'Dumbbell',
    'Hammer',
    'Kettlebell',
    'Leverage Machine',
    'Medicine Ball',
    'Resistance Band',
    'Roll',
    'Rope',
    'Sled Machine',
    'Smith Machine',
    'Stability Ball',
    'Suspension',
    'Trap Bar',
    'Wheel Roller',
];

export function ExerciseForm({
    initialData,
    categories,
    onSubmit,
    isSaving,
    submitLabel = 'Save Exercise',
    errorMessage = '',
}) {
    const [formState, setFormState] = useState({
        title: initialData?.title ?? '',
        description: initialData?.description ?? '',
        instructions: initialData?.instructions ?? '',
        difficulty: initialData?.difficulty ?? DIFFICULTIES[0],
        muscle: initialData?.muscle ?? MUSCLE_OPTIONS[0],
        equipment: initialData?.equipment ?? EQUIPMENT_OPTIONS[0],
        categories: new Set((initialData?.categories ?? []).map((category) => category.id)),
    });
    const [imageFile, setImageFile] = useState(null);

    const selectedCategories = useMemo(
        () => Array.from(formState.categories),
        [formState.categories],
    );

    const handleCategoryToggle = (categoryId) => {
        setFormState((previous) => {
            const nextCategories = new Set(previous.categories);
            if (nextCategories.has(categoryId)) {
                nextCategories.delete(categoryId);
            } else {
                nextCategories.add(categoryId);
            }

            return {
                ...previous,
                categories: nextCategories,
            };
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
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

        if (imageFile) {
            payload.append('image', imageFile);
        }

        onSubmit(payload);
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {errorMessage && (
                <div className="alert alert-error text-sm">{errorMessage}</div>
            )}

            <div className="space-y-2">
                <label className="label"><span className="label-text">Image</span></label>
                <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    accept="image/*"
                    onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="form-control">
                    <span className="label-text">Title</span>
                    <input
                        type="text"
                        className="input input-bordered"
                        value={formState.title}
                        onChange={(event) => setFormState((previous) => ({ ...previous, title: event.target.value }))}
                        required
                    />
                </label>
                <label className="form-control">
                    <span className="label-text">Difficulty</span>
                    <select
                        className="select select-bordered"
                        value={formState.difficulty}
                        onChange={(event) => setFormState((previous) => ({ ...previous, difficulty: event.target.value }))}
                        required
                    >
                        {DIFFICULTIES.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </label>
            </div>

            <label className="form-control">
                <span className="label-text">Description</span>
                <textarea
                    className="textarea textarea-bordered min-h-24"
                    value={formState.description}
                    onChange={(event) => setFormState((previous) => ({ ...previous, description: event.target.value }))}
                    required
                />
            </label>

            <label className="form-control">
                <span className="label-text">Instructions</span>
                <textarea
                    className="textarea textarea-bordered min-h-28"
                    value={formState.instructions}
                    onChange={(event) => setFormState((previous) => ({ ...previous, instructions: event.target.value }))}
                    required
                />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="form-control">
                    <span className="label-text">Muscle</span>
                    <select
                        className="select select-bordered"
                        value={formState.muscle}
                        onChange={(event) => setFormState((previous) => ({ ...previous, muscle: event.target.value }))}
                        required
                    >
                        {MUSCLE_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </label>
                <label className="form-control">
                    <span className="label-text">Equipment</span>
                    <select
                        className="select select-bordered"
                        value={formState.equipment}
                        onChange={(event) => setFormState((previous) => ({ ...previous, equipment: event.target.value }))}
                        required
                    >
                        {EQUIPMENT_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="space-y-2">
                <p className="text-sm font-medium">Categories</p>
                <div className="grid gap-2 sm:grid-cols-2">
                    {categories.map((category) => (
                        <label key={category.id} className="label cursor-pointer justify-start gap-2 border border-base-300 rounded-lg px-3 py-2">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-primary checkbox-sm"
                                checked={formState.categories.has(category.id)}
                                onChange={() => handleCategoryToggle(category.id)}
                            />
                            <span className="label-text">{category.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : submitLabel}
            </button>
        </form>
    );
}
