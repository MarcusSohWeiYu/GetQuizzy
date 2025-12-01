import mongoose from 'mongoose';
import toJSON from './plugins/toJSON';

const responseSchema = new mongoose.Schema({
    // Survey reference
    surveyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey',
        required: true,
    },
    
    // All answers for this submission grouped together
    answers: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true,
        },
        answer: {
            type: mongoose.Schema.Types.Mixed, // Can be String, Number, Array, etc.
            required: true,
        },
    }],
    

    // Respondent information (optional - for anonymous surveys)
    respondentId: {
        type: String,
        trim: true,
        default: 'anonymous',
    },

    respondentEmail: {
        type: String,
        trim: true,
        lowercase: true,
    },
    
    respondentName: {
        type: String,
        trim: true,
    },
    
    // Metadata for analytics
    metadata: {
        ipAddress: String,
        userAgent: String,
        deviceType: String, // 'mobile', 'tablet', 'desktop'
        browser: String,
        completionTime: Number, // Total time in seconds to complete survey
    },
    
    // Status tracking
    isComplete: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt
});

// Add indexes for common queries
responseSchema.index({ surveyId: 1, createdAt: -1 });

// Add plugin for consistent JSON serialization
responseSchema.plugin(toJSON);

export default mongoose.models.Response || mongoose.model('Response', responseSchema);