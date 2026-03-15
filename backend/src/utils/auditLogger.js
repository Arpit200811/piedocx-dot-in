import AuditLog from '../models/AuditLog.js';

export const logAdminAction = async (req, action, targetId = null, details = {}) => {
    try {
        if (!req.admin) return; // Only log if admin is authenticated

        await AuditLog.create({
            adminId: req.admin.id,
            adminEmail: req.admin.email,
            action,
            targetId: targetId ? targetId.toString() : null,
            details,
            ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        });
    } catch (error) {
        console.error("Audit Logging Error:", error);
    }
};

// Middleware to automatically log successful POST/PUT/DELETE requests for specific patterns
export const auditMiddleware = (actionName) => {
    return async (req, res, next) => {
        const originalSend = res.send;
        res.send = function (data) {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                // Log only successful operations
                logAdminAction(req, actionName, req.params.id || req.body.id || null, {
                    method: req.method,
                    path: req.originalUrl,
                    body: req.method !== 'GET' ? req.body : null
                });
            }
            return originalSend.apply(res, arguments);
        };
        next();
    };
};
