import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  disasterType: { 
    type: String, 
    enum: ['Flood', 'Earthquake', 'Cyclone', 'Heatwave', 'Landslide', 'Other'], 
    required: true 
  },
  location: {
    state: { type: String, required: true },
    district: { type: String, required: true }
  },
  date: { type: Date, required: true },
  originalFileUrl: { type: String }, // Cloudinary URL format
  extractedText: { type: String }, // From OCR
  aiSummary: { type: String },
  tags: [{ type: String }],
  
  ngoDetails: {
    name: { type: String },
    type: { type: String, enum: ['Food', 'Medical', 'Rescue', 'Shelter', 'Other'] },
    areaOfOperation: [{ type: String }],
    resourcesProvided: [{ type: String }]
  },

  volunteerDetails: {
    count: { type: Number, default: 0 },
    roles: [{ type: String }],
    availability: { type: String }
  },

  assessment: {
    problemsFaced: [{ type: String }],
    solutionsImplemented: [{ type: String }],
    outcomes: {
      whatWorked: { type: String },
      whatFailed: { type: String },
      recoveryEfficiency: { type: String, enum: ['Low', 'Medium', 'High'] }
    }
  },
  
  detailedAnalysis: {
    executiveSummary: { type: String },
    contextualOverview: { type: String },
    impactAssessment: { type: String },
    infrastructureDamage: { type: String },
    responseEfforts: { type: String },
    causesRiskFactors: { type: String },
    futureRecommendations: { type: String }
  },

  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, min: 1, max: 5 }
  }]
}, { timestamps: true });

reportSchema.index({ tags: 'text', title: 'text', extractedText: 'text' });

export default mongoose.model('Report', reportSchema);
