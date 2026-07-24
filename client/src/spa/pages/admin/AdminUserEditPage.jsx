import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api';
import { extractErrorMessage, unwrapItem } from '../../utils';

export function AdminUserEditPage() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [role, setRole] = useState('user');

    const userQuery = useQuery({
        queryKey: ['admin-user', userId],
        queryFn: async () => {
            const response = await api.get(`/admin/users/${userId}`);
            return unwrapItem(response);
        },
    });

    useEffect(() => {
        if (!userQuery.data) {
            return;
        }

        setName(userQuery.data.name ?? '');
        setBirthDate(userQuery.data.birth_date ?? '');
        setRole(userQuery.data.is_admin ? 'admin' : 'user');
    }, [userQuery.data]);

    const updateMutation = useMutation({
        mutationFn: async () => {
            await api.patch(`/admin/users/${userId}`, {
                name,
                email: userQuery.data.email,
                birth_date: birthDate,
                is_admin: role === 'admin',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            queryClient.invalidateQueries({ queryKey: ['admin-user', userId] });
            navigate('/admin/users');
        },
    });

    const errorMessage = updateMutation.isError
        ? extractErrorMessage(updateMutation.error, 'Could not update user.')
        : '';

    if (userQuery.isLoading) {
        return (
            <main className="px-[15px] lg:px-7 py-7 max-w-xl mx-auto w-full flex-1">
                <div className="alert bg-base-100 border border-base-300">
                    <span>Loading user...</span>
                </div>
            </main>
        );
    }

    if (userQuery.isError || !userQuery.data) {
        return (
            <main className="px-[15px] lg:px-7 py-7 max-w-xl mx-auto w-full flex-1">
                <div className="alert alert-error">
                    <span>User not found.</span>
                </div>
            </main>
        );
    }

    const user = userQuery.data;

    return (
        <main className="px-[15px] lg:px-7 py-7 max-w-xl mx-auto w-full flex-1">
            <h1 className="text-2xl font-bold mb-7">Edit User</h1>

            <div className="card bg-base-100 shadow-md">
                <div className="card-body">
                    <div className="mb-5">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-base-content/60">{user.email}</p>
                    </div>

                    {errorMessage && (
                        <div className="alert alert-error mb-3">
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            updateMutation.mutate();
                        }}
                    >
                        <fieldset className="fieldset mb-5">
                            <label className="fieldset-label" htmlFor="name">Name</label>
                            <input
                                id="name"
                                type="text"
                                className="input w-full"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                            />
                        </fieldset>

                        <fieldset className="fieldset mb-5">
                            <label className="fieldset-label" htmlFor="birth_date">Birth Date</label>
                            <input
                                id="birth_date"
                                type="date"
                                className="input w-full"
                                value={birthDate}
                                onChange={(event) => setBirthDate(event.target.value)}
                                required
                            />
                        </fieldset>

                        <fieldset className="fieldset mb-5">
                            <label className="fieldset-label">Role</label>
                            <label className="label cursor-pointer justify-start gap-3">
                                <input
                                    type="radio"
                                    name="role"
                                    value="user"
                                    className="radio radio-primary"
                                    checked={role === 'user'}
                                    onChange={() => setRole('user')}
                                />
                                <span className="label-text">User</span>
                            </label>
                            <label className="label cursor-pointer justify-start gap-3">
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    className="radio radio-primary"
                                    checked={role === 'admin'}
                                    onChange={() => setRole('admin')}
                                />
                                <span className="label-text">Admin</span>
                            </label>
                        </fieldset>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                className="btn bg-base-200 text-base-content border border-base-300 hover:bg-base-200"
                                onClick={() => navigate('/admin/users')}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
