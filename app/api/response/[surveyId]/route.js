import { NextResponse } from "next/server";
import connectMongo from "@/libs/db/mongoose";
import Response from "@/models/Response";
import Question from "@/models/Question";
import { auth } from "@/libs/api/next-auth";

// GET all responses for a specific survey
export async function GET(req, { params }) {
  try {
    const { surveyId } = params;

    if (!surveyId) {
      return NextResponse.json(
        { error: "Survey ID is required" },
        { status: 400 }
      );
    }

    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Fetch all responses for this survey
    const responses = await Response.find({ surveyId })
      .sort({ createdAt: -1 })
      .lean();

    // Fetch all questions for this survey to provide context
    const questions = await Question.find({ surveyId })
      .sort({ order: 1 })
      .lean();

    // Calculate stats
    const stats = {
      totalResponses: responses.length,
      completionRate: responses.length > 0 
        ? Math.round((responses.filter(r => r.isComplete).length / responses.length) * 100) 
        : 0,
      avgCompletionTime: responses.length > 0 && responses[0].metadata?.completionTime
        ? Math.round(responses.reduce((acc, r) => acc + (r.metadata?.completionTime || 0), 0) / responses.length)
        : 0,
    };

    return NextResponse.json({
      responses,
      questions,
      stats,
    }, { status: 200 });

  } catch (error) {
    console.error("Fetch responses error:", error);
    return NextResponse.json({
      error: error.message || "Failed to fetch responses"
    }, { status: 500 });
  }
}
