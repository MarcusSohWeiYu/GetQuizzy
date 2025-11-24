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

//Create surverys
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
      status: "active",
      aiInstructions: body.aiInstructions,
    });

    user.surveys.push(survey._id);
    await user.save();
    return NextResponse.json({ survey }, { status: 201 });
  } catch (error) {
    console.error("Survey Creation Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error:" + error.message },
      { status: 500 }
    );
  }
}
