import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    adminEmail: { type: String, required: true },
    action: { type: String, required: true }, // e.g., 'TEST_UPDATE', 'STUDENT_DELETE', 'CERT_REVOKE'
    targetId: { type: String }, // ID of the entity affected
    details: { type: mongoose.Schema.Types.Mixed }, // JSON details of what was changed
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('AuditLog', AuditLogSchema);
