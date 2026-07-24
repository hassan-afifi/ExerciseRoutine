import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { extractErrorMessage } from '../utils';

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [formState, setFormState] = useState({
        email: '',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            await login({
                ...formState,
                device_name: 'spa-browser',
            });
            const redirectTarget = location.state?.from?.pathname ?? '/';
            navigate(redirectTarget, { replace: true });
        } catch (error) {
            setErrorMessage(extractErrorMessage(error, 'Invalid login credentials.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex-1 flex items-center justify-center p-4">
            <div className="card bg-base-100 shadow-xl w-full max-w-md">
                <div className="card-body">
                    <h2 className="text-2xl font-bold text-center mb-6">Log in</h2>

                    {errorMessage && <div className="alert alert-error text-sm mb-4">{errorMessage}</div>}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <fieldset className="fieldset mb-4">
                            <label className="fieldset-label" htmlFor="email">Email</label>
                            <input
                                id="email"
                                className="input w-full"
                                type="email"
                                value={formState.email}
                                onChange={(event) => setFormState((previous) => ({ ...previous, email: event.target.value }))}
                                required
                                autoFocus
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

                        <button className="btn btn-primary w-full" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Signing in...' : 'Log in'}
                        </button>
                    </form>

                    <p className="text-center text-sm mt-4 text-base-content/60">
                        Don&apos;t have an account? <Link className="link link-primary font-medium" to="/register">Register</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
