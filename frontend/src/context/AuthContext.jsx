import React , {createContext, useState, useEffect} from 'react';
import { loadStoredUser } from '../utils/authHelpers';

export const AuthContext = createContext();

const AuthProvider = ({children})=> {
    const [user, setUser] = useState(() => loadStoredUser());

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem("userInfo");
    }

    useEffect(() => {
        const syncUserFromServer = async () => {
            const stored = loadStoredUser();
            if (!stored?.token) return;

            try {
                const res = await fetch('/api/v1/auth/me', {
                    headers: { Authorization: `Bearer ${stored.token}` },
                });

                if (!res.ok) return;

                const data = await res.json();
                const updatedUser = {
                    ...stored,
                    ...data,
                    token: stored.token,
                };

                setUser(updatedUser);
                localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            } catch {
                // Keep stored session if profile sync fails
            }
        };

        syncUserFromServer();
    }, []);

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );

};

export default AuthProvider;