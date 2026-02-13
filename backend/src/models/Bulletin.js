import mongoose from "mongoose";

const bulletinSchema = new mongoose.Schema({
    text: { type: String, required: true },
    type: { type: String, enum: ['urgent', 'info', 'promo'], default: 'info' },
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
});

const Bulletin = mongoose.model("Bulletin", bulletinSchema);
export default Bulletin;
