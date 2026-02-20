import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const StudentAuthContext = createContext({
    student: null,
    setStudent: () => { },
    login: () => { },
    logout: () => { },
    loading: true,
    isAuthenticated: false
});

export const StudentAuthProvider = ({ children }) => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);
            const token = localStorage.getItem('studentToken');
            const savedStudent = localStorage.getItem('studentData');

            if (token && savedStudent) {
                try {
                    const parsedStudent = JSON.parse(savedStudent);
                    setStudent(parsedStudent);

                    // Verify session with backend
                    const updatedData = await api.get('/api/student-auth/profile');
                    if (updatedData) {
                        if (!updatedData.firstName && updatedData.fullName) {
                            updatedData.firstName = updatedData.fullName.split(' ')[0];
                        }
                        setStudent(updatedData);
                        localStorage.setItem('studentData', JSON.stringify(updatedData));
                        localStorage.setItem('studentToken', token); // Refresh logic implicitly
                    }
                } catch (err) {
                    console.error("Auth verification failed:", err);
                    // Only logout if token is explicitly invalid (401)
                    if (err.response && err.response.status === 401) {
                        logout();
                    } else {
                        // Network error or server downtime? proper session remains valid locally
                        console.warn("Keeping local session active due to non-auth error");
                    }
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const login = (studentData, token) => {
        if (!studentData.firstName && studentData.fullName) {
            studentData.firstName = studentData.fullName.split(' ')[0];
        }
        localStorage.setItem('studentToken', token);
        localStorage.setItem('studentData', JSON.stringify(studentData));
        setStudent(studentData);
    };

    const logout = () => {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentData');
        setStudent(null);
    };

    const value = {
        student,
        setStudent,
        login,
        logout,
        loading,
        isAuthenticated: !!student
    };

    return (
        <StudentAuthContext.Provider value={value}>
            {children}
        </StudentAuthContext.Provider>
    );
};

export const useStudentAuth = () => {
    const context = useContext(StudentAuthContext);
    if (context === undefined) {
        console.error("useStudentAuth Hook returned undefined! Checking Provider status...");
    }
    return context;
};
