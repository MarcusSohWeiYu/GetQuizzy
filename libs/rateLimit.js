import connectMongo from "@/libs/db/mongoose";
import RateLimit from "@/models/RateLimit";

/**
 * Rate limiting configuration per endpoint
 */
const RATE_LIMITS = {
  "/api/openai/avatar": {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
    // windowMs: 30 * 1000, // 30 seconds (TEST)
    message: "AI Avatar generation limit exceeded. Please try again in {timeLeft}.",
  },
  "/api/openai/custom": {
    maxRequests: 2,
    windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
    // windowMs: 30 * 1000, // 30 seconds (TEST)
    message: "AI content generation limit exceeded. Please try again in {timeLeft}.",
  },
};

/**
 * Get client identifier from request
 * Uses combination of IP address and survey/response ID for tracking
 */
function getClientIdentifier(req, responseId = null, surveyId = null) {
  // Get IP address from various headers (handles proxies/load balancers)
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown";
  
  // For survey-level rate limiting (prevent spam of survey completions)
  if (surveyId) {
    return `IP_${ip}_SURVEY_${surveyId}`;
  }
  
  // For response-level rate limiting (cache hits)
  if (responseId) {
    return `IP_${ip}_RESPONSE_${responseId}`;
  }
  
  // Fallback to IP + User-Agent hash for general rate limiting
  const userAgent = req.headers.get("user-agent") || "unknown";
  const uaHash = Buffer.from(userAgent).toString("base64").substring(0, 10);
  return `IP_${ip}_UA_${uaHash}`;
}

/**
 * Format time remaining in human-readable format
 */
function formatTimeRemaining(ms) {
  const minutes = Math.ceil(ms / (60 * 1000));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  }
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

/**
 * Check if request should be rate limited
 * @param {Request} req - Next.js request object
 * @param {string} endpoint - API endpoint path
 * @param {string} responseId - Optional response ID for tracking
 * @param {string} surveyId - Optional survey ID for tracking (preferred for limiting survey access)
 * @returns {Promise<{allowed: boolean, limit?: object, error?: string, retryAfter?: number}>}
 */
export async function checkRateLimit(req, endpoint, responseId = null, surveyId = null) {
  try {
    await connectMongo();
    
    // Get rate limit config for this endpoint
    const config = RATE_LIMITS[endpoint];
    if (!config) {
      // No rate limit configured for this endpoint
      return { allowed: true };
    }
    
    // Get client identifier (prefer surveyId over responseId for spam prevention)
    const identifier = getClientIdentifier(req, responseId, surveyId);
    
    // Find existing rate limit record
    const now = new Date();
    const windowStart = new Date(now.getTime() - config.windowMs);
    
    let rateLimitRecord = await RateLimit.findOne({
      identifier,
      apiEndpoint: endpoint,
      windowStart: { $gte: windowStart },
    });
    
    // If no record exists, create one
    if (!rateLimitRecord) {
      const expiresAt = new Date(now.getTime() + config.windowMs);
      
      rateLimitRecord = await RateLimit.create({
        identifier,
        apiEndpoint: endpoint,
        requestCount: 1,
        windowStart: now,
        expiresAt,
        requests: [{ timestamp: now }],
      });
      
      return {
        allowed: true,
        limit: {
          remaining: config.maxRequests - 1,
          total: config.maxRequests,
          reset: expiresAt,
        },
      };
    }
    
    // Check if limit exceeded
    if (rateLimitRecord.requestCount >= config.maxRequests) {
      const timeRemaining = rateLimitRecord.expiresAt.getTime() - now.getTime();
      const timeRemainingFormatted = formatTimeRemaining(timeRemaining);
      
      return {
        allowed: false,
        error: config.message.replace("{timeLeft}", timeRemainingFormatted),
        retryAfter: Math.ceil(timeRemaining / 1000), // in seconds
        limit: {
          remaining: 0,
          total: config.maxRequests,
          reset: rateLimitRecord.expiresAt,
        },
      };
    }
    
    // Increment request count
    rateLimitRecord.requestCount += 1;
    rateLimitRecord.requests.push({ timestamp: now });
    await rateLimitRecord.save();
    
    return {
      allowed: true,
      limit: {
        remaining: config.maxRequests - rateLimitRecord.requestCount,
        total: config.maxRequests,
        reset: rateLimitRecord.expiresAt,
      },
    };
    
  } catch (error) {
    console.error("Rate limit check error:", error);
    // On error, allow the request (fail open)
    // You might want to change this to fail closed in production
    return { allowed: true };
  }
}

/**
 * Get rate limit status without incrementing counter
 */
export async function getRateLimitStatus(req, endpoint, responseId = null, surveyId = null) {
  try {
    await connectMongo();
    
    const config = RATE_LIMITS[endpoint];
    if (!config) {
      return { exists: false };
    }
    
    const identifier = getClientIdentifier(req, responseId, surveyId);
    const now = new Date();
    const windowStart = new Date(now.getTime() - config.windowMs);
    
    const rateLimitRecord = await RateLimit.findOne({
      identifier,
      apiEndpoint: endpoint,
      windowStart: { $gte: windowStart },
    });
    
    if (!rateLimitRecord) {
      return {
        exists: false,
        remaining: config.maxRequests,
        total: config.maxRequests,
      };
    }
    
    return {
      exists: true,
      remaining: Math.max(0, config.maxRequests - rateLimitRecord.requestCount),
      total: config.maxRequests,
      reset: rateLimitRecord.expiresAt,
      exceeded: rateLimitRecord.requestCount >= config.maxRequests,
    };
    
  } catch (error) {
    console.error("Rate limit status check error:", error);
    return { exists: false, error: error.message };
  }
}
