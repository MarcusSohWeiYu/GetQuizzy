import { NextResponse } from "next/server";
import connectMongo from "@/libs/db/mongoose";
import Response from "@/models/Response";
import { auth } from "@/libs/api/next-auth";

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate request body
    if (!body.answers || !Array.isArray(body.answers) || body.answers.length === 0) {
      return NextResponse.json(
        { error: "Missing answers array" },
        { status: 400 }
      );
    }

    if (!body.surveyId) {
      return NextResponse.json(
        { error: "Missing surveyId" },
        { status: 400 }
      );
    }


    // Get auth session (if user is logged in)
    const session = await auth();
    const respondentId = session?.user?.id || "anonymous";

    await connectMongo();

    // Create single response document with all answers
    const response = await Response.create({
      surveyId: body.surveyId,
      answers: body.answers, // Array of { questionId, answer }
      respondentId: respondentId,
      metadata: body.metadata || {},
      isComplete: true,
    });

    return NextResponse.json({ 
      message: "Response recorded successfully",
      responseId: response._id,
      answersCount: body.answers.length 
    }, { status: 201 });

  } catch (error) {
    console.error("Response submission error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to save response" 
    }, { status: 500 });
  }
}
