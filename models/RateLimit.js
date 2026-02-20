import mongoose from "mongoose";

// Schema for tracking API rate limits
const rateLimitSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    index: true,
  },
  apiEndpoint: {
    type: String,
    required: true,
    index: true,
  },
  requestCount: {
    type: Number,
    default: 1,
    required: true,
  },
  windowStart: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true, // For TTL
  },
  requests: [{
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    }
  }],
}, {
  timestamps: true,
});

// Compound index for faster lookups
rateLimitSchema.index({ identifier: 1, apiEndpoint: 1 });

// TTL index - MongoDB will automatically delete documents after expiresAt
rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RateLimit = mongoose.models.RateLimit || mongoose.model("RateLimit", rateLimitSchema);

export default RateLimit;
