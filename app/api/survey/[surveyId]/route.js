import { NextResponse } from "next/server";
import connectMongo from "@/libs/db/mongoose";
import Survey from "@/models/Survey";
import Question from "@/models/Question";
import { auth } from "@/libs/api/next-auth";

// PUT - Update survey and questions
export async function PUT(req, { params }) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { surveyId } = await params;
    const body = await req.json();
    const { name, description, status, questions, resultExperience } = body;

    await connectMongo();

    // Verify ownership
    const survey = await Survey.findOne({
      _id: surveyId,
      userId: session.user.id
    });

    if (!survey) {
      return NextResponse.json(
        { error: "Survey not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update survey details
    survey.name = name;
    survey.description = description;
    survey.status = status;
    
    // Update resultExperience if provided
    if (resultExperience !== undefined) {
      survey.resultExperience = resultExperience;
    }
    
    await survey.save();

    // Delete existing questions
    await Question.deleteMany({ surveyId: surveyId });

    // Create new questions with updated order
    const questionPromises = questions.map((q, index) =>
      Question.create({
        title: q.title,
        questionType: q.questionType,
        options: q.options || [],
        order: index,
        surveyId: surveyId,
        required: q.required || false
      })
    );

    await Promise.all(questionPromises);

    return NextResponse.json({
      success: true,
      message: "Survey updated successfully"
    });

  } catch (error) {
    console.error("Error updating survey:", error);
    return NextResponse.json(
      { error: "Failed to update survey" },
      { status: 500 }
    );
  }
}
