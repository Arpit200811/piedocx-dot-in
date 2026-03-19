
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
            url.includes('/certificate/send-');

        const isStudentRoute = url.includes('/student-auth/');
        
        const isPublicRoute = 
            url.includes('/certificate/verify-public/') || 
            url.includes('/certificate/view/');

        if (isAdminRoute) {
            token = localStorage.getItem('adminToken');
        } else if (isStudentRoute) {
            token = localStorage.getItem('studentToken');
        } else if (isPublicRoute) {
            token = null; // Don't send tokens for public verification
        } else {
            // General routes (fallback order)
            token = localStorage.getItem('adminToken') || localStorage.getItem('studentToken');
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling & State Logic
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

        if (!isSilent) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: message,
                confirmButtonColor: '#2563eb'
            });
        }

        // Handle Session Expiry
        if (error.response?.status === 401) {
            // localStorage.clear(); // Use with caution
            // window.location.href = '/login'; 
        }

        return Promise.reject(error);
    }
);

export default api;
