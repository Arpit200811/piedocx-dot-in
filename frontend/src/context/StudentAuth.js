import { createContext, useContext } from 'react';

export const StudentAuthContext = createContext({
    student: null,
    setStudent: () => { },
    login: () => { },
    logout: () => { },
    loading: true,
    isAuthenticated: false
});

export const useStudentAuth = () => {
    const context = useContext(StudentAuthContext);
    if (context === undefined) {
        console.error("useStudentAuth Hook returned undefined! Checking Provider status...");
    }
    return context;
};
