import ButtonAccount from "@/components/ButtonAccount";
import { auth } from "@/libs/api/next-auth";
import connectMongo from "@/libs/db/mongoose";
import User from "@/models/User";
import Survey from "@/models/Survey";
import Link from "next/link";
import ButtonDeleteSurvey from "@/components/survey/ButtonDeleteSurvey";

export const dynamic = "force-dynamic";

// Hardcoded survey data for now
const surveys = [
  {
    id: 1,
    title: "What's Your Personality Type?",
    description: "Discover your unique character through fun questions",
    responses: 1247,
    completionRate: 87,
    shares: 432,
    createdAt: "2025-11-15",
    status: "active",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    title: "Which Fantasy Character Are You?",
    description: "Find out which fantasy hero matches your vibe",
    responses: 856,
    completionRate: 92,
    shares: 324,
    createdAt: "2025-11-10",
    status: "active",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    title: "Customer Satisfaction Survey",
    description: "Help us improve your experience",
    responses: 423,
    completionRate: 68,
    shares: 87,
    createdAt: "2025-11-05",
    status: "active",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 4,
    title: "Travel Style Quiz",
    description: "What kind of traveler are you?",
    responses: 234,
    completionRate: 79,
    shares: 156,
    createdAt: "2025-11-01",
    status: "draft",
    color: "from-green-500 to-teal-500"
  },
];

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
  const numberOfSurveys = user.surveys || [];

  return (
    <main className="min-h-screen bg-base-100 p-8 pb-24">
      <section className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">My Surveys</h1>
            <p className="text-base-content/70">Create and manage your AI-powered surveys</p>
          </div>
          <div className="flex items-center gap-4">
            <ButtonAccount />
            <Link href="/survey/new">
            <button className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create Survey
            </button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-base-200 rounded-lg p-6">
            <div className="text-sm text-base-content/70 mb-1">Total Surveys</div>
            <div className="text-3xl font-bold">{numberOfSurveys.length}</div>
          </div>
          <div className="bg-base-200 rounded-lg p-6">
            <div className="text-sm text-base-content/70 mb-1">Total Responses</div>
            <div className="text-3xl font-bold">
              {surveys.reduce((acc, s) => acc + s.responses, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-base-200 rounded-lg p-6">
            <div className="text-sm text-base-content/70 mb-1">Avg Completion</div>
            <div className="text-3xl font-bold">
              {Math.round(surveys.reduce((acc, s) => acc + s.completionRate, 0) / surveys.length)}%
            </div>
          </div>
          <div className="bg-base-200 rounded-lg p-6">
            <div className="text-sm text-base-content/70 mb-1">Total Shares</div>
            <div className="text-3xl font-bold">
              {surveys.reduce((acc, s) => acc + s.shares, 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Survey Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.surveys.map((survey, index) => {
            const surveyId = survey._id.toString();
            return (
            <div key={survey.id} className="card bg-base-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-200" style={{ zIndex: user.surveys.length - index }}>
              {/* Gradient Header with Icon */}
              <div className={`h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-t-lg flex items-center justify-center relative overflow-hidden`}>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
                
                {/* Survey Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-white z-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              
              <div className="card-body">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="card-title text-lg flex-1">{survey.name}</h2>
                  <div className={`badge badge-sm ${survey.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                    {survey.status}
                  </div>
                </div>
                <p className="text-sm text-base-content/70 mb-4">{survey.description}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <div className="text-xs text-base-content/60">Responses</div>
                    <div className="font-bold">10</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-base-content/60">Completion</div>
                    <div className="font-bold text-success">50%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-base-content/60">Shares</div>
                    <div className="font-bold text-primary">123</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="card-actions justify-between items-center pt-2 border-t border-base-300">
                  <span className="text-xs text-base-content/50 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    {new Date(survey.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button className="btn btn-sm btn-primary">View</button>
                    <div className="dropdown dropdown-end">
                      <button tabIndex={0} role="button" className="btn btn-sm btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                        </svg>
                      </button>
                      <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-lg bg-base-200 rounded-box w-52 border border-base-300">
                        <li>
                          <a>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                            </svg>
                            Analytics
                          </a>
                        </li>
                        <li>
                          <a>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            Edit
                          </a>
                        </li>
                        <li>
                          <ButtonDeleteSurvey surveyId={surveyId} />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Empty State (if no surveys) */}
        {surveys.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold mb-2">No surveys yet</h3>
            <p className="text-base-content/70 mb-6">Create your first AI-powered survey to get started</p>
            <button className="btn btn-primary btn-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create Your First Survey
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
