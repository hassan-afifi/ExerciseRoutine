import { Link } from 'react-router-dom';

export function ExerciseCard({ exercise, onToggleFavourite, canToggleFavourite = false, showOwner = false, showEdit = false }) {
    return (
        <div className="card bg-base-100 shadow-md border border-base-300">
            <Link to={`/exercises/${exercise.id}`} className="card-body gap-3">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="card-title text-lg">{exercise.title}</h3>
                    <span className="badge badge-primary uppercase">{exercise.difficulty}</span>
                </div>
                <p className="text-sm text-base-content/80 line-clamp-2">{exercise.description}</p>
                <div className="flex flex-wrap gap-2">
                    <span className="badge badge-outline">{exercise.muscle}</span>
                    <span className="badge badge-outline">{exercise.equipment}</span>
                    {(exercise.categories ?? []).map((category) => (
                        <span key={category.id} className="badge category-badge">{category.name}</span>
                    ))}
                </div>
                {showOwner && exercise.owner && (
                    <p className="text-xs text-base-content/70">By {exercise.owner.name}</p>
                )}
            </Link>
            <div className="card-actions justify-end px-5 pb-5">
                {showEdit && (
                    <Link to={`/exercises/${exercise.id}/edit`} className="btn btn-outline btn-sm btn-primary">
                        Edit
                    </Link>
                )}
                {canToggleFavourite && (
                    <button
                        type="button"
                        className={`btn btn-sm ${exercise.is_favourite ? 'btn-error' : 'btn-primary'}`}
                        onClick={() => onToggleFavourite?.(exercise)}
                    >
                        {exercise.is_favourite ? 'Unfavourite' : 'Favourite'}
                    </button>
                )}
            </div>
        </div>
    );
}
