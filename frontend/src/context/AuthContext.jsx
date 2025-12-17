import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// Get API URL from env or default to relative path (which uses proxy in dev)
const BASE_URL = import.meta.env.VITE_API_URL || '';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from backend on mount (verify cookie)
    useEffect(() => {
        const loadUser = async () => {
            try {
                // If checking auth status on a different domain, credentials: 'include' is crucial
                const res = await fetch(`${BASE_URL}/api/auth/me`, {
                    credentials: 'include'
                });
                const data = await res.json();
                if (data.user) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error('Failed to load user session', error);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const loginWithGoogle = async (token) => {
        try {
            const res = await fetch(`${BASE_URL}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
                credentials: 'include'
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                return data.user;
            } else {
                console.error('Login failed:', data.message);
                toast.error(`Backend Login Failed: ${data.message}. \n\nPlease configure server .env with real keys.`);
                return null;
            }
        } catch (error) {
            console.error('Login request failed', error);
            return null;
        }
    };

    const loginWithEmail = async (email, password) => {
        try {
            const res = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                return true;
            } else {
                toast.error(data.message || 'Login failed');
                return false;
            }
        } catch (error) {
            console.error('Login error', error);
            return false;
        }
    };

    const registerWithEmail = async (email, password, name) => {
        try {
            const res = await fetch(`${BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name }),
                credentials: 'include'
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                return true;
            } else {
                toast.error(data.message || 'Registration failed');
                return false;
            }
        } catch (error) {
            console.error('Registration error', error);
            return false;
        }
    };

    const loginWithGithub = async (code) => {
        try {
            const res = await fetch(`${BASE_URL}/api/auth/github`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
                credentials: 'include'
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                return true;
            } else {
                toast.error(data.message || 'GitHub Login failed');
                return false;
            }
        } catch (error) {
            console.error('GitHub Login error', error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await fetch(`${BASE_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            setUser(null);
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    const updateHandle = async (platform, handle) => {
        // Optimistic update
        setUser(prev => ({
            ...prev,
            apiHandles: { ...prev?.apiHandles, [platform]: handle }
        }));

        try {
            const res = await fetch(`${BASE_URL}/api/auth/update-handles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform, handle }),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.user) setUser(data.user);
        } catch (err) {
            console.error('Failed to update handle', err);
        }
    };

    const updateProfile = async (details) => {
        try {
            const res = await fetch(`${BASE_URL}/api/auth/update-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details),
                credentials: 'include'
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error('Update profile error', err);
            return false;
        }
    };

    const deleteAccount = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/auth/delete`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                setUser(null);
                return true;
            }
            return false;
        } catch (err) {
            console.error('Delete account error', err);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithGithub, loginWithEmail, registerWithEmail, updateHandle, updateProfile, deleteAccount, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
