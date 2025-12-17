//Import that sends HTTP response back to the frontend
import { NextResponse } from "next/server";

//Checking if user is authentication
//Since we are using it on the backend and not client, we can just import it directly
import { auth } from "@/libs/api/next-auth";

//To connect to the database
import connectMongo from "@/libs/db/mongoose";

//Retrieving user with user models
import User from "@/models/User";

import Survey from "@/models/Survey";
import Question from "@/models/Question";
import Response from "@/models/Response";

//Create survery
export async function POST(req) {
  try {
    //Getting the body from the request
    const body = await req.json();

    //Validating the body
    if (!body.name || !body.description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    //Checking if user is authenticated
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //Connecting to the database
    await connectMongo();
    //Finding user by id
    //Funtionality from mongoose library itself
    //To find the user info itself, not the user id
    const user = await User.findById(session.user.id);

    //Create survey in the database
    const survey = await Survey.create({
      userId: user._id,
      name: body.name,
      description: body.description,
      status: body.status || "active",
      resultExperience: body.resultExperience || {
        enabled: false,
        components: []
      },
    });

    // Create questions in the database
    if (body.questions && Array.isArray(body.questions) && body.questions.length > 0) {
      const questionsWithSurveyId = body.questions.map(q => ({
        ...q,
        surveyId: survey._id
      }));
      
      await Question.insertMany(questionsWithSurveyId);
    }

    user.surveys.push(survey._id);
    await user.save();
    return NextResponse.json({ survey, surveyId: survey._id }, { status: 201 });
  } catch (error) {
    console.error("Survey Creation Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error:" + error.message },
      { status: 500 }
    );
  }
}

//Delete survery
export async function DELETE(req) {
    try {
        //Accessing the URL
        const { searchParams } = req.nextUrl;
        const surveyId = searchParams.get("id");

        //Checking if survey ID was passed
        if (!surveyId){
            return NextResponse.json({ error: "Survey ID is required" }, { status: 400 });
        }

        //Checking if the user is authorised to delete the survey
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        //Connecting to the database
        await connectMongo();

        //Finding the user by id
        const user = await User.findById(session.user?.id);

        //Deleting the survey from the db (using user._id instead of session.user._id)
        await Survey.deleteOne({
            _id: surveyId,
            userId: user._id
        })

        //Also delete all questions associated with this survey
        await Question.deleteMany({ surveyId: surveyId });

        //Also delete all responses associated with this survey
        await Response.deleteMany({ surveyId: surveyId });

        //Remove survey from user's surveys array
        user.surveys = user.surveys.filter((id) => {
            return id.toString() !== surveyId;
        })

        await user.save();

        return NextResponse.json({ message: "Survey deleted successfully" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}