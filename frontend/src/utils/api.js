
import axios from 'axios';
import { base_url } from './info';
import Swal from 'sweetalert2';

/**
 * Centralized API Instance
 */
const api = axios.create({
    baseURL: base_url,
    timeout: 120000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor: Inject Token
api.interceptors.request.use(
    (config) => {
        const url = config.url || '';
        let token = null;

        // Strict Token Isolation
        const isAdminRoute = 
            url.includes('/admin/') || 
            url.includes('/analytics/') || 
            url.includes('/whatsapp/') || 
            url.includes('/certificate/bulk-') || 
            url.includes('/certificate/students') || 
            url.includes('/certificate/send-single');

        const isStudentRoute = 
            url.includes('/student-auth/') ||
            url.includes('/certificate/send-email');
        
        if (isAdminRoute) {
            token = localStorage.getItem('adminToken');
        } else if (isStudentRoute) {
            token = localStorage.getItem('studentToken');
        } else {
            // General routes (fallback order)
            // This will handle Public routes by sending whichever token is available
            token = localStorage.getItem('adminToken') || localStorage.getItem('studentToken');
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || error.message || 'Network Error';
        
        // Don't show modal for specific errors that components handle locally
        const silentErrors = [
            'Sync rejected', 
            'Time is over', 
            'No active test', 
            'Test not found', 
            'published',
            '404'
        ];
        
        const isSilent = silentErrors.some(s => 
            (message && message.toLowerCase().includes(s.toLowerCase())) || 
            (error.response?.status.toString() === s)
        );

        // Enhanced Network Error Reporting
        let finalMessage = message;
        if (message === 'Network Error' || !error.response) {
            finalMessage = "Network Connection Issue: Please check your internet or retry in a moment.";
            console.error(" [NETWORK_CRITICAL] ", error);
        }

        if (!isSilent) {
            Swal.fire({
                icon: 'error',
                title: 'Operation Failed',
                text: finalMessage,
                confirmButtonColor: '#2563eb'
            });
        }

        // Handle Session Expiry or Role Mismatch - Forces a clean login to prevent stale states
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('studentToken');
            localStorage.removeItem('studentData');
            // Check if we were on a student-prefixed route
            if (window.location.hash.includes('student-') || window.location.hash.includes('dashboard')) {
                window.location.href = '/#/student-login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
