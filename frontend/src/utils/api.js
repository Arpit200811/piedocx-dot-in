
import axios from 'axios';
import { base_url } from './info';
import Swal from 'sweetalert2';

/**
 * Centralized API Instance
 */
const api = axios.create({
    baseURL: base_url,
    timeout: 30000,
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
        if (url.includes('/admin/') || url.includes('/analytics/')) {
            token = localStorage.getItem('adminToken');
        } else if (url.includes('/student-auth/') || url.includes('/certificate/')) {
            token = localStorage.getItem('studentToken');
        } else {
            // General routes (fallback order)
            token = localStorage.getItem('studentToken') || localStorage.getItem('adminToken');
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
        const silentErrors = ['Sync rejected', 'Time is over'];
        const isSilent = silentErrors.some(s => message.includes(s));

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
