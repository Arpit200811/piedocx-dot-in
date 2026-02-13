import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['PDF', 'Link', 'Video'], default: 'PDF' },
    link: { type: String, required: true },
    size: { type: String, default: 'External' }, // e.g., '2.4 MB'
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
});

const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;
