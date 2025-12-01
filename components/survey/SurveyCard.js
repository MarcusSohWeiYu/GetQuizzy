"use client";

import { toast } from "react-hot-toast";
import ButtonDeleteSurvey from "./ButtonDeleteSurvey";

export default function SurveyCard({ survey }) {
  const surveyId = survey._id;
  
  // Determine the base URL based on environment
  const getPublicUrl = () => {
    if (process.env.NODE_ENV === 'development') {
      return `http://localhost:3000/b/${surveyId}`;
    }
    // Replace with your actual production domain
    return `https://getquizzy.com/b/${surveyId}`;
  };

  const publicUrl = getPublicUrl();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success('Link copied to clipboard!', {
        duration: 2000,
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #a855f7',
        },
        iconTheme: {
          primary: '#a855f7',
          secondary: '#fff',
        },
      });
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-purple-500/20 transition-all hover:-translate-y-2 duration-300 border border-gray-700/50 overflow-visible relative [&:has(details[open])]:z-50">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-xl font-bold flex-1 line-clamp-2 text-white">{survey.name}</h2>
          <div className={`badge badge-lg font-semibold ${
            survey.status === 'active' 
              ? 'bg-green-500/20 text-green-300 border-green-500/50' 
              : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
          }`}>
            {survey.status}
          </div>
        </div>
        <p className="text-sm text-gray-400 line-clamp-2 h-10">{survey.description}</p>
        
        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          Created {new Date(survey.createdAt).toLocaleDateString()}
        </div>


        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 py-4 border-y border-gray-700">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Responses</div>
            <div className="font-bold text-lg text-white">10</div>
          </div>
          <div className="text-center border-x border-gray-700">
            <div className="text-xs text-gray-500 mb-1">Completion</div>
            <div className="font-bold text-lg text-green-400">50%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Shares</div>
            <div className="font-bold text-lg text-purple-400">123</div>
          </div>
        </div>

        {/* Public Link Section */}
        <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-700/50">
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-purple-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
            <span className="text-xs font-semibold text-gray-400">Public Link</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={publicUrl}
              readOnly
              className="flex-1 bg-gray-800 text-gray-300 text-xs px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              onClick={copyToClipboard}
              className="btn btn-square btn-sm bg-purple-600 hover:bg-purple-700 border-none text-white"
              title="Copy to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            </button>
          </div>
        </div>


        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm py-2 rounded-lg hover:scale-105 transition-all duration-200 shadow-md hover:shadow-purple-500/50">
            View Survey
          </button>
          <details className="dropdown dropdown-end">
            <summary className="btn btn-square btn-ghost hover:bg-gray-700/50 text-gray-300 list-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
              </svg>
            </summary>
            <ul className="dropdown-content menu p-2 shadow-2xl bg-gray-800 rounded-2xl w-56 border border-gray-700 space-y-1 z-[9999]">
              <li>
                <a className="rounded-xl hover:bg-gray-700 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  Analytics (Coming Soon)
                </a>
              </li>
              <li>
                <a className="rounded-xl hover:bg-gray-700 text-gray-300">
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
          </details>
        </div>
      </div>
    </div>
  );
}
