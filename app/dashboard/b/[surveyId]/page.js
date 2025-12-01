import { redirect } from "next/navigation";

import connectMongo from "@/libs/db/mongoose";
import Survey from "@/models/Survey";
import Question from "@/models/Question";

import { auth } from "@/libs/api/next-auth";

import AdminSurvey from "@/components/survey/AdminSurvey";
import { use } from "react";

//Function to get survey data using survey ID
const getData = async (surveyId) => {

    const session = await auth();

    if (!session) {
        redirect("/dashboard");
    }

    await connectMongo();

    const survey = await Survey.findOne({
        _id: surveyId,
        userId: session?.user?.id
    });

    if (!survey) {
        redirect("/dashboard");
    }


    const questions = await Question.find({ surveyId: surveyId }).sort({ order: 1 });

    
    return { survey, questions };
};

export default async function AdminSurveyPage({params}) {
    const { surveyId } = await params;

    const { survey, questions } = await getData(surveyId);

    // Serialize and ensure _id is a string
    const serializedSurvey = JSON.parse(JSON.stringify(survey));
    const serializedQuestions = JSON.parse(JSON.stringify(questions));
    
    // Convert _id to string if it's an object
    serializedSurvey._id = survey._id.toString();
    serializedQuestions.forEach(q => {
        q._id = q._id.toString ? q._id.toString() : q._id;
    });

    return (
        <AdminSurvey survey={serializedSurvey} questions={serializedQuestions} />
    )
}