import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, clearToken, getToken, setToken } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setTokenState] = useState(getToken());
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(Boolean(getToken()));

    useEffect(() => {
        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        let isMounted = true;
        api.get('/me')
            .then((response) => {
                if (!isMounted) {
                    return;
                }

                setUser(response.data.data ?? response.data);
            })
            .catch(() => {
                if (!isMounted) {
                    return;
                }

                clearToken();
                setTokenState(null);
                setUser(null);
            })
            .finally(() => {
                if (!isMounted) {
                    return;
                }

                setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [token]);

    const login = async (payload) => {
        const response = await api.post('/login', payload);
        const nextToken = response.data.token;
        setToken(nextToken);
        setTokenState(nextToken);
        setUser(response.data.user?.data ?? response.data.user);
    };

    const register = async (payload) => {
        const response = await api.post('/register', payload);
        const nextToken = response.data.token;
        setToken(nextToken);
        setTokenState(nextToken);
        setUser(response.data.user?.data ?? response.data.user);
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch {
            // best effort logout
        }

        clearToken();
        setTokenState(null);
        setUser(null);
    };

    const refreshUser = async () => {
        if (!token) {
            return null;
        }

        const response = await api.get('/me');
        const nextUser = response.data.data ?? response.data;
        setUser(nextUser);
        return nextUser;
    };

    const value = useMemo(() => ({
        token,
        user,
        isLoading,
        isAuthenticated: Boolean(token && user),
        isAdmin: Boolean(user?.is_admin),
        login,
        register,
        logout,
        refreshUser,
    }), [token, user, isLoading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }

    return context;
}
