import { NextResponse } from "next/server";
import connectMongo from "@/libs/db/mongoose";
import Survey from "@/models/Survey";
import Question from "@/models/Question";
import { auth } from "@/libs/api/next-auth";

// PUT - Update survey and questions and result experience
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

    // Get existing questions
    const existingQuestions = await Question.find({ surveyId: surveyId });
    const existingQuestionIds = existingQuestions.map(q => q._id.toString());
    const incomingQuestionIds = questions
      .filter(q => q._id || q.id)
      .map(q => (q._id || q.id).toString());

    // Delete questions that are no longer in the incoming array
    const questionsToDelete = existingQuestionIds.filter(
      id => !incomingQuestionIds.includes(id)
    );
    if (questionsToDelete.length > 0) {
      await Question.deleteMany({ _id: { $in: questionsToDelete } });
    }

    // Update or create questions
    const questionPromises = questions.map(async (q, index) => {
      const questionId = q._id || q.id;
      
      // Check if questionId is a valid ObjectId (24 hex characters) and not a temporary ID
      const isValidObjectId = questionId && 
        typeof questionId === 'string' && 
        !questionId.startsWith('temp-') && 
        questionId.match(/^[0-9a-fA-F]{24}$/);
      
      if (isValidObjectId) {
        // Update existing question
        return await Question.findByIdAndUpdate(
          questionId,
          {
            title: q.title,
            questionType: q.questionType,
            options: q.options || [],
            order: index,
            required: q.required || false
          },
          { new: true }
        );
      } else {
        // Create new question
        return await Question.create({
          title: q.title,
          questionType: q.questionType,
          options: q.options || [],
          order: index,
          surveyId: surveyId,
          required: q.required || false
        });
      }
    });

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
