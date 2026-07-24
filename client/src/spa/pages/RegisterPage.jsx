import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { extractErrorMessage } from '../utils';

export function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formState, setFormState] = useState({
        name: '',
        birth_date: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            await register(formState);
            navigate('/', { replace: true });
        } catch (error) {
            setErrorMessage(extractErrorMessage(error, 'Could not register user.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex-1 flex items-center justify-center p-4">
            <div className="card bg-base-100 shadow-xl w-full max-w-md">
                <div className="card-body">
                    <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

                    {errorMessage && <div className="alert alert-error text-sm mb-4">{errorMessage}</div>}

                    <form onSubmit={handleSubmit}>
                        <fieldset className="fieldset mb-4">
                            <label className="fieldset-label" htmlFor="name">Name</label>
                            <input
                                id="name"
                                className="input w-full"
                                type="text"
                                value={formState.name}
                                onChange={(event) => setFormState((previous) => ({ ...previous, name: event.target.value }))}
                                required
                                autoFocus
                            />
                        </fieldset>

                        <fieldset className="fieldset mb-4">
                            <label className="fieldset-label" htmlFor="birth_date">Birth Date</label>
                            <input
                                id="birth_date"
                                className="input w-full"
                                type="date"
                                value={formState.birth_date}
                                onChange={(event) => setFormState((previous) => ({ ...previous, birth_date: event.target.value }))}
                                required
                            />
                        </fieldset>

                        <fieldset className="fieldset mb-4">
                            <label className="fieldset-label" htmlFor="email">Email</label>
                            <input
                                id="email"
                                className="input w-full"
                                type="email"
                                value={formState.email}
                                onChange={(event) => setFormState((previous) => ({ ...previous, email: event.target.value }))}
                                required
                            />
                        </fieldset>

                        <fieldset className="fieldset mb-4">
                            <label className="fieldset-label" htmlFor="password">Password</label>
                            <input
                                id="password"
                                className="input w-full"
                                type="password"
                                value={formState.password}
                                onChange={(event) => setFormState((previous) => ({ ...previous, password: event.target.value }))}
                                required
                            />
                        </fieldset>

                        <fieldset className="fieldset mb-6">
                            <label className="fieldset-label" htmlFor="password_confirmation">Confirm Password</label>
                            <input
                                id="password_confirmation"
                                className="input w-full"
                                type="password"
                                value={formState.password_confirmation}
                                onChange={(event) => setFormState((previous) => ({ ...previous, password_confirmation: event.target.value }))}
                                required
                            />
                        </fieldset>

                        <button className="btn btn-primary w-full" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating account...' : 'Register'}
                        </button>
                    </form>

                    <p className="text-center text-sm mt-4 text-base-content/60">
                        Already registered? <Link className="link link-primary font-medium" to="/login">Log in</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
