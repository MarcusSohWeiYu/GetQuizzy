import { auth } from "@/libs/api/next-auth";
import connectMongo from "@/libs/db/mongoose";
import User from "@/models/User";
import DashboardContent from "@/components/DashboardContent";

export const dynamic = "force-dynamic";

async function getUser() {
  const session = await auth();

  //Await connection to be established with the database
  await connectMongo();

  return await User.findById(session.user.id).populate("surveys");
}

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  //Get the user data
  const user = await getUser();

  //Count how many surveys the user has
  const surveys = user.surveys || [];

  // Serialize user data to avoid circular references - use JSON parse/stringify for deep cleaning
  const serializedData = JSON.parse(JSON.stringify({
    userId: user._id.toString(),
    userName: user.name,
    userEmail: user.email,
    surveys: surveys.map((survey) => ({
      _id: survey._id.toString(),
      name: survey.name || "",
      description: survey.description || "",
      status: survey.status || "draft",
      createdAt: survey.createdAt ? new Date(survey.createdAt).toISOString() : new Date().toISOString(),
    })),
  }));

  return <DashboardContent userData={serializedData} />;
}
