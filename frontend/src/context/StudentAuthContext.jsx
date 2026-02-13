import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { base_url } from '../utils/info';

const StudentAuthContext = createContext();

export const StudentAuthProvider = ({ children }) => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('studentToken');
            const savedStudent = localStorage.getItem('studentData');

            if (token && savedStudent) {
                try {
                    const parsedStudent = JSON.parse(savedStudent);
                    setStudent(parsedStudent);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    
                    // Verify token with backend to ensure it's still valid
                    try {
                        const res = await axios.get(`${base_url}/api/student-auth/profile`);
                        if (res.data) {
                            const updatedData = res.data;
                            if (!updatedData.firstName && updatedData.fullName) {
                                updatedData.firstName = updatedData.fullName.split(' ')[0];
                            }
                            setStudent(updatedData);
                            localStorage.setItem('studentData', JSON.stringify(updatedData));
                        }
                    } catch (err) {
                        if (err.response?.status === 401) {
                            logout();
                        }
                    }
                } catch (e) {
                    logout();
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
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setStudent(studentData);
    };

    const logout = () => {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentData');
        delete axios.defaults.headers.common['Authorization'];
        setStudent(null);
    };

    return (
        <StudentAuthContext.Provider value={{ student, login, logout, loading, isAuthenticated: !!student }}>
            {children}
        </StudentAuthContext.Provider>
    );
};

export const useStudentAuth = () => useContext(StudentAuthContext);
