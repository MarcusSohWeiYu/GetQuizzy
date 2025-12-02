import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// Survey Schema

//Updated schema
const surveySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['draft', 'active', 'paused', 'closed'],
      default: 'draft',
    },
    // AI Instructions for avatar generation
    aiInstructions: {
      type: String,
      trim: true,
      default: 'Generate a character avatar based on the survey responses',
    },
    
    // Result Experience configuration
    resultExperience: {
      enabled: {
        type: Boolean,
        default: false,
      },
      components: [{
        id: Number,
        type: {
          type: String,
          enum: ['ai-avatar', 'ai-custom', 'custom-message', 'discount-code', 'cta-button', 'social-share'],
        },
        order: Number,
        config: mongoose.Schema.Types.Mixed,
      }],
    },
    
    // Response count
    responses: {
      type: Number,
      default: 0,
    },
    
    // Creator reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,  // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
  }
);

// Add plugin that converts mongoose to json
surveySchema.plugin(toJSON);

export default mongoose.models.Survey || mongoose.model("Survey", surveySchema);
