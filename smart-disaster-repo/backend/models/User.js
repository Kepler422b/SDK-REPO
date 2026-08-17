import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Admin', 'NGO', 'Volunteer', 'Viewer'], 
    default: 'Viewer' 
  },
  organization: { type: String, default: null } // Applicable for NGO users
}, { timestamps: true });

export default mongoose.model('User', userSchema);
