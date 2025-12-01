"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ResponsesTab = ({ surveyId, onResponsesLoad }) => {
  const [responses, setResponses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState({
    totalResponses: 0,
    completionRate: 0,
    avgCompletionTime: 0,
  });
  const [loading, setLoading] = useState(true);
  const [expandedResponse, setExpandedResponse] = useState(null);

  useEffect(() => {
    if (surveyId) {
      fetchResponses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surveyId]);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/response/${surveyId}`);
      setResponses(data.responses || []);
      setQuestions(data.questions || []);
      setStats(data.stats || stats);
      
      // Update parent component with response count
      if (onResponsesLoad) {
        onResponsesLoad(data.responses?.length || 0);
      }
    } catch (error) {
      console.error("Error fetching responses:", error);
      toast.error("Failed to load responses");
    } finally {
      setLoading(false);
    }
  };

  const getQuestionById = (questionId) => {
    return questions.find((q) => q._id === questionId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const toggleResponseDetails = (responseId) => {
    setExpandedResponse(expandedResponse === responseId ? null : responseId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-lg text-base-content/60 mb-2 font-semibold">No responses yet</p>
        <p className="text-sm text-base-content/40">
          Share your survey to start collecting responses
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-bold text-2xl text-base-content">Survey Responses</h2>
        <div className="flex gap-2">
          <button className="btn btn-sm btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/70 mb-1">Total Responses</p>
              <p className="text-3xl font-bold text-purple-400">{stats.totalResponses}</p>
            </div>
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-xl p-6 border border-pink-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/70 mb-1">Completion Rate</p>
              <p className="text-3xl font-bold text-pink-400">{stats.completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/70 mb-1">Avg. Time</p>
              <p className="text-3xl font-bold text-orange-400">
                {stats.avgCompletionTime > 0
                  ? `${Math.floor(stats.avgCompletionTime / 60)}m ${stats.avgCompletionTime % 60}s`
                  : "N/A"}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Responses List */}
      <div className="space-y-4">
        {responses.map((response) => {
          const isExpanded = expandedResponse === response._id;
          return (
            <div 
              key={response._id} 
              className="bg-base-200 rounded-2xl hover:shadow-lg transition-all border-2 border-transparent hover:border-purple-300 overflow-hidden"
            >
              {/* Response Header */}
              <div className="p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {response.respondentName
                          ? response.respondentName.charAt(0).toUpperCase()
                          : response.respondentId === "anonymous"
                          ? "?"
                          : "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base-content">
                            {response.respondentName || "Anonymous"}
                          </h3>
                          {response.isComplete && (
                            <span className="badge badge-sm badge-success">Complete</span>
                          )}
                        </div>
                        {response.respondentEmail && (
                          <p className="text-sm text-base-content/60">{response.respondentEmail}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-base-content/70 flex-wrap">
                      {response.metadata?.completionTime && (
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {Math.floor(response.metadata.completionTime / 60)}m{" "}
                          {response.metadata.completionTime % 60}s
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        {formatDate(response.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                        {response.answers.length} answers
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => toggleResponseDetails(response._id)}
                    className="btn btn-sm btn-outline btn-primary gap-2"
                  >
                    {isExpanded ? "Hide" : "View"} Details
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t-2 border-base-300 bg-base-100 p-6">
                  <div className="space-y-4">
                    {response.answers.map((answer, index) => {
                      const question = getQuestionById(answer.questionId);
                      if (!question) return null;

                      return (
                        <div
                          key={answer.questionId}
                          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-5 border-l-4 border-purple-500"
                        >
                          <div className="flex gap-4">
                            <span className="badge badge-primary badge-lg shrink-0">Q{index + 1}</span>
                            <div className="flex-1 space-y-3">
                              <p className="font-semibold text-base-content">
                                {question.title}
                              </p>
                              <div className="bg-base-200 rounded-lg p-4 border-2 border-purple-300/30">
                                <p className="text-base-content font-medium">
                                  ✨ {answer.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Metadata Section */}
                    {response.metadata && (
                      <div className="pt-4 mt-4 border-t-2 border-dashed border-base-300">
                        <h5 className="text-sm font-bold text-base-content/60 mb-3 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                          </svg>
                          Response Metadata
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {response.metadata.deviceType && (
                            <div className="bg-base-200 rounded-lg p-3">
                              <p className="text-xs text-base-content/50 mb-1">Device</p>
                              <p className="text-sm text-base-content capitalize font-medium">
                                {response.metadata.deviceType}
                              </p>
                            </div>
                          )}
                          {response.metadata.browser && (
                            <div className="bg-base-200 rounded-lg p-3">
                              <p className="text-xs text-base-content/50 mb-1">Browser</p>
                              <p className="text-sm text-base-content font-medium">
                                {response.metadata.browser}
                              </p>
                            </div>
                          )}
                          {response.metadata.ipAddress && (
                            <div className="bg-base-200 rounded-lg p-3">
                              <p className="text-xs text-base-content/50 mb-1">IP Address</p>
                              <p className="text-sm text-base-content font-mono font-medium">
                                {response.metadata.ipAddress}
                              </p>
                            </div>
                          )}
                          <div className="bg-base-200 rounded-lg p-3">
                            <p className="text-xs text-base-content/50 mb-1">Response ID</p>
                            <p className="text-xs text-base-content font-mono truncate" title={response._id}>
                              {response._id}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResponsesTab;
