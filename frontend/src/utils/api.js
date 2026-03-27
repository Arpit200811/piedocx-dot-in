
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
        const statusCode = error.response?.status;
        
        // Don't show modal for specific errors that components handle locally
        const silentErrors = [
            'Sync rejected', 
            'Time is over', 
            'No active test', 
            'Test not found', 
            'published',
            '404',
            '401', // Silent redirect handles this
            'Session expired'
        ];
        
        const isSilent = silentErrors.some(s => 
            (message && message.toLowerCase().includes(s.toLowerCase())) || 
            (statusCode?.toString() === s)
        );

        // Handle Session Expiry (401 ONLY) - 403 might be a valid business rejection (late submission)
        if (statusCode === 401) {
            const isStudentDashboard = window.location.hash.toLowerCase().includes('student') || 
                                       window.location.hash.toLowerCase().includes('dashboard');
            
            if (isStudentDashboard) {
                localStorage.removeItem('studentToken'); // Clear student token
                window.location.href = '#/student-login'; // Use relative hash for stability
                return new Promise(() => {}); // Stop error propagation to avoid further UI breaks
            }
        }

        // Enhanced Network Error Reporting
        let finalMessage = message;
        if (message === 'Network Error' || !error.response) {
            finalMessage = "Connection Issues: Please check your internet or retry.";
            console.warn(" [NETWORK_ISSUE] ", error);
        }

        if (!isSilent) {
            Swal.fire({
                icon: 'error',
                title: error.response ? 'Access Denied' : 'Connection Issue',
                text: finalMessage,
                confirmButtonColor: '#2563eb',
                toast: !error.response,
                position: error.response ? 'center' : 'top-end',
                timer: error.response ? undefined : 3000
            });
        }

        return Promise.reject(error);
    }
);

export default api;
