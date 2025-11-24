import ButtonAccount from "@/components/ButtonAccount";
import { auth } from "@/libs/api/next-auth";
import connectMongo from "@/libs/db/mongoose";
import User from "@/models/User";
import Link from "next/link";
import ButtonDeleteSurvey from "@/components/survey/ButtonDeleteSurvey";

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
  const numberOfSurveys = user.surveys || [];

  return (
    <main className="min-h-screen bg-base-100 p-8 pb-24">
      <section className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              My Surveys
            </h1>
            <p className="text-base-content/70 text-lg">Create and manage your AI-powered surveys</p>
          </div>
          <div className="flex items-center gap-4">
            <ButtonAccount />
            <Link href="/survey/new">
              <button className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-bold px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-orange-500/50 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Survey
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-purple-700 dark:text-purple-300">Total Surveys</div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-purple-900 dark:text-purple-100">{numberOfSurveys.length}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">Total Responses</div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-blue-900 dark:text-blue-100">15</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-green-700 dark:text-green-300">Avg Completion</div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-green-900 dark:text-green-100">10%</div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-2xl p-6 border-2 border-pink-200 dark:border-pink-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-pink-700 dark:text-pink-300">Total Shares</div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-pink-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-pink-900 dark:text-pink-100">10</div>
          </div>
        </div>

        {/* Survey Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.surveys.map((survey, index) => {
            const surveyId = survey._id.toString();
            return (
            <div key={survey.id} className="bg-base-100 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 overflow-hidden border border-base-300" style={{ zIndex: user.surveys.length - index }}>
              {/* Gradient Header with Icon */}
              <div className="h-32 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 flex items-center justify-center relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -translate-y-12 translate-x-12 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
                
                {/* Survey Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-white z-10 drop-shadow-lg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-xl font-bold flex-1 line-clamp-2">{survey.name}</h2>
                  <div className={`badge badge-lg font-semibold ${survey.status === 'active' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-yellow-100 text-yellow-700 border-yellow-300'}`}>
                    {survey.status}
                  </div>
                </div>
                <p className="text-sm text-base-content/70 line-clamp-2 h-10">{survey.description}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 py-4 border-y border-base-300">
                  <div className="text-center">
                    <div className="text-xs text-base-content/60 mb-1">Responses</div>
                    <div className="font-bold text-lg">10</div>
                  </div>
                  <div className="text-center border-x border-base-300">
                    <div className="text-xs text-base-content/60 mb-1">Completion</div>
                    <div className="font-bold text-lg text-success">50%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-base-content/60 mb-1">Shares</div>
                    <div className="font-bold text-lg text-primary">123</div>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-base-content/50">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  Created {new Date(survey.createdAt).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-bold py-2.5 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg">
                    View Survey
                  </button>
                  <div className="dropdown dropdown-end">
                    <button tabIndex={0} role="button" className="btn btn-square btn-ghost hover:bg-base-200">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                      </svg>
                    </button>
                    <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-2xl bg-base-100 rounded-2xl w-56 border border-base-300 space-y-1">
                      <li>
                        <a className="rounded-xl hover:bg-base-200">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                          </svg>
                          Analytics
                        </a>
                      </li>
                      <li>
                        <a className="rounded-xl hover:bg-base-200">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
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
            );
          })}
        </div>

        {/* Empty State (if no surveys) */}
        {numberOfSurveys.length === 0 && (
          <div className="text-center py-20 bg-base-200 rounded-3xl border-2 border-dashed border-base-300">
            <div className="text-7xl mb-6 animate-bounce">📋</div>
            <h3 className="text-3xl font-extrabold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              No surveys yet
            </h3>
            <p className="text-base-content/70 text-lg mb-8 max-w-md mx-auto">
              Create your first AI-powered survey to get started and watch your engagement soar!
            </p>
            <Link href="/survey/new">
              <button className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-bold px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-orange-500/50 inline-flex items-center gap-2 text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Your First Survey
              </button>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
