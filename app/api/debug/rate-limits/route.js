import { NextResponse } from "next/server";
import connectMongo from "@/libs/db/mongoose";
import RateLimit from "@/models/RateLimit";

// DEBUG ENDPOINT - Remove in production
export async function GET(req) {
  try {
    await connectMongo();
    
    // Get all rate limit records
    const rateLimits = await RateLimit.find({}).sort({ createdAt: -1 }).limit(20);
    
    const now = new Date();
    const formattedLimits = rateLimits.map(rl => ({
      identifier: rl.identifier,
      endpoint: rl.apiEndpoint,
      requestCount: rl.requestCount,
      windowStart: rl.windowStart,
      expiresAt: rl.expiresAt,
      isExpired: rl.expiresAt < now,
      minutesSinceWindow: Math.floor((now - rl.windowStart) / (1000 * 60)),
      minutesUntilExpiry: Math.floor((rl.expiresAt - now) / (1000 * 60))
    }));
    
    return NextResponse.json({
      totalRecords: rateLimits.length,
      currentTime: now,
      rateLimits: formattedLimits
    });
  } catch (error) {
    console.error("Debug rate limits error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rate limits", details: error.message },
      { status: 500 }
    );
  }
}

// Clear all rate limits (for testing only)
export async function DELETE(req) {
  try {
    await connectMongo();
    
    const result = await RateLimit.deleteMany({});
    
    return NextResponse.json({
      message: "All rate limits cleared",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Clear rate limits error:", error);
    return NextResponse.json(
      { error: "Failed to clear rate limits", details: error.message },
      { status: 500 }
    );
  }
}
