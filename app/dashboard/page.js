import ButtonAccount from "@/components/ButtonAccount";
import Image from "next/image";
import Link from "next/link";

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
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&auto=format&fit=crop&q=80"
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
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80"
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
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80"
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
    thumbnail: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&auto=format&fit=crop&q=80"
  },
];

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
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
            <div className="text-3xl font-bold">{surveys.length}</div>
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
          {surveys.map((survey) => (
            <div key={survey.id} className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
              <figure className="h-48 overflow-hidden relative">
                <Image
                  src={survey.thumbnail} 
                  alt={survey.title}
                  fill
                  className="object-cover"
                />
              </figure>
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <h2 className="card-title text-lg">{survey.title}</h2>
                  <div className={`badge ${survey.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                    {survey.status}
                  </div>
                </div>
                <p className="text-sm text-base-content/70 mb-4">{survey.description}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <div className="text-xs text-base-content/60">Responses</div>
                    <div className="font-bold">{survey.responses}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-base-content/60">Completion</div>
                    <div className="font-bold text-success">{survey.completionRate}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-base-content/60">Shares</div>
                    <div className="font-bold text-primary">{survey.shares}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="card-actions justify-between items-center">
                  <span className="text-xs text-base-content/50">
                    Created {new Date(survey.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button className="btn btn-sm btn-ghost">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                      </svg>
                    </button>
                    <button className="btn btn-sm btn-ghost">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    <button className="btn btn-sm btn-primary">View</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
