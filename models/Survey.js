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
    
    // Result Experience configuration
    resultExperience: {
      enabled: {
        type: Boolean,
        default: false,
      },
      components: [{
        id: {
          type: Number,
          required: true,
        },
        type: {
          type: String,
          required: true,
          enum: ['ai-avatar', 'ai-custom', 'custom-message', 'discount-code', 'cta-button'],
        },
        order: {
          type: Number,
          required: true,
        },
        config: {
          type: mongoose.Schema.Types.Mixed,
          default: {},
        },
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
