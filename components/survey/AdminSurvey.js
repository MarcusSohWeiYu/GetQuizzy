"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ButtonDeleteSurvey from "./ButtonDeleteSurvey";
import ResponsesTab from "./ResponsesTab";
import ComponentLibrary, { availableComponents } from "./resultComponents/ComponentLibrary";
import AIAvatarComponent from "./resultComponents/AIAvatarComponent";
import AICustomComponent from "./resultComponents/AICustomComponent";

const AdminSurvey = ({ survey, questions }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("questions");
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiGenerationMode, setAiGenerationMode] = useState("add"); // "add" or "edit"
  const [responseCount, setResponseCount] = useState(0);

  // Initialize survey data from props
  const [surveyData, setSurveyData] = useState({
    _id: "",
    name: "",
    description: "",
    status: "active",
    createdAt: "",
    questions: [],
    resultExperience: {
      enabled: false,
      components: []
    }
  });

  // Store original data for cancel functionality
  const [originalSurveyData, setOriginalSurveyData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Update surveyData when props change
  useEffect(() => {
    if (survey && questions) {
      const data = {
        _id: survey._id,
        name: survey.name || "",
        description: survey.description || "",
        status: survey.status || "active",
        createdAt: survey.createdAt || "",
        questions: questions.map(q => ({
          id: q._id,
          title: q.title || "",
          questionType: q.questionType || "multiple-choice",
          options: q.options || []
        })),
        resultExperience: survey.resultExperience || {
          enabled: false,
          components: []
        }
      };
      setSurveyData(data);
      // Save original data for cancel functionality
      setOriginalSurveyData(JSON.parse(JSON.stringify(data)));
    }
  }, [survey, questions]);

  const updateSurveyField = (field, value) => {
    setSurveyData({ ...surveyData, [field]: value });
  };

  // Result Experience Functions
  const getDefaultConfig = (type) => {
    switch (type) {
      case 'ai-avatar':
        return { aiInstructions: 'Create a unique character based on their survey responses. The avatar should reflect their personality traits, communication style, and behavioral patterns.' };
      case 'ai-custom':
        return { title: 'Your Personalized Insights', prompt: '', sections: [] };
      case 'custom-message':
        return { message: 'Thank you for completing our survey!' };
      case 'discount-code':
        return { code: 'SURVEY20', message: 'Get 20% off your next purchase!' };
      case 'cta-button':
        return { buttonText: 'Visit Website', buttonUrl: 'https://example.com' };
      default:
        return {};
    }
  };

  const addResultComponent = (type) => {
    const newComponent = {
      id: Date.now(),
      type: type,
      order: surveyData.resultExperience.components.length,
      config: getDefaultConfig(type)
    };
    
    setSurveyData({
      ...surveyData,
      resultExperience: {
        ...surveyData.resultExperience,
        components: [...surveyData.resultExperience.components, newComponent]
      }
    });
  };

  const removeResultComponent = (componentId) => {
    setSurveyData({
      ...surveyData,
      resultExperience: {
        ...surveyData.resultExperience,
        components: surveyData.resultExperience.components
          .filter(c => c.id !== componentId)
          .map((c, index) => ({ ...c, order: index }))
      }
    });
  };

  const updateComponentConfig = (componentId, field, value) => {
    setSurveyData({
      ...surveyData,
      resultExperience: {
        ...surveyData.resultExperience,
        components: surveyData.resultExperience.components.map(c =>
          c.id === componentId
            ? { ...c, config: { ...c.config, [field]: value } }
            : c
        )
      }
    });
  };

  const updateQuestion = (questionId, field, value) => {
    setSurveyData({
      ...surveyData,
      questions: surveyData.questions.map((q) =>
        q.id === questionId ? { ...q, [field]: value } : q
      ),
    });
  };

  const updateOption = (questionId, optionIndex, value) => {
    setSurveyData({
      ...surveyData,
      questions: surveyData.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === optionIndex ? { text: value, value: value.toLowerCase().replace(/\s+/g, '-') } : opt
              ),
            }
          : q
      ),
    });
  };

  const addQuestion = () => {
    setSurveyData({
      ...surveyData,
      questions: [
        ...surveyData.questions,
        { id: Date.now(), title: "", questionType: "multiple-choice", options: [{ text: "", value: "" }] }
      ]
    });
  };

  const removeQuestion = (questionId) => {
    setSurveyData({
      ...surveyData,
      questions: surveyData.questions.filter((q) => q.id !== questionId)
    });
  };

  const addOption = (questionId) => {
    setSurveyData({
      ...surveyData,
      questions: surveyData.questions.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, { text: "", value: "" }] } : q
      )
    });
  };

  const removeOption = (questionId, optionIndex) => {
    setSurveyData({
      ...surveyData,
      questions: surveyData.questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
          : q
      )
    });
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", index.toString());
    setDraggedIndex(index);
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    // Auto-scroll when dragging near edges
    const scrollThreshold = 100; // pixels from edge to trigger scroll
    const scrollSpeed = 10; // pixels per frame
    const viewportHeight = window.innerHeight;
    const mouseY = e.clientY;
    
    if (mouseY < scrollThreshold) {
      // Near top - scroll up
      window.scrollBy(0, -scrollSpeed);
    } else if (mouseY > viewportHeight - scrollThreshold) {
      // Near bottom - scroll down
      window.scrollBy(0, scrollSpeed);
    }
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();
    
    const actualDragIndex = draggedIndex;
    
    if (actualDragIndex === null || actualDragIndex === dropIndex) {
      setDragOverIndex(null);
      return;
    }
    
    const newQuestions = [...surveyData.questions];
    const [draggedItem] = newQuestions.splice(actualDragIndex, 1);
    
    let insertIndex;
    if (actualDragIndex < dropIndex) {
      insertIndex = dropIndex;
    } else {
      insertIndex = dropIndex;
    }
    
    newQuestions.splice(insertIndex, 0, draggedItem);
    
    setSurveyData({
      ...surveyData,
      questions: newQuestions
    });
    setDragOverIndex(null);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Validate survey data
      if (!surveyData.name.trim()) {
        toast.error('Survey name is required');
        return;
      }
      
      if (!surveyData.description.trim()) {
        toast.error('Survey description is required');
        return;
      }
      
      if (surveyData.questions.length === 0) {
        toast.error('At least one question is required');
        return;
      }
      
      // Validate each question
      for (let i = 0; i < surveyData.questions.length; i++) {
        const q = surveyData.questions[i];
        if (!q.title.trim()) {
          toast.error(`Question ${i + 1} title is required`);
          return;
        }
        if (q.questionType === 'multiple-choice' && q.options.length === 0) {
          toast.error(`Question ${i + 1} needs at least one option`);
          return;
        }
      }
      
      const response = await fetch(`/api/survey/${surveyData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: surveyData.name,
          description: surveyData.description,
          status: surveyData.status,
          questions: surveyData.questions,
          resultExperience: surveyData.resultExperience
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save survey');
      }
      
      toast.success('Survey saved successfully!', {
        icon: '✅',
        duration: 3000,
      });
      
      // Update original data to new saved state
      setOriginalSurveyData(JSON.parse(JSON.stringify(surveyData)));
      setIsEditMode(false);
      
      // Reload the page to get fresh data from database
      window.location.reload();
      
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save survey');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalSurveyData) {
      // Revert to original data
      setSurveyData(JSON.parse(JSON.stringify(originalSurveyData)));
    }
    setIsEditMode(false);
    toast.success('Changes cancelled', {
      icon: '↩️',
      duration: 2000,
    });
  };

  const handleAIGenerate = () => {
    // TODO: Implement AI generation
    setShowAIModal(false);
    toast.success(aiGenerationMode === "add" ? "AI will add new questions!" : "AI will enhance existing questions!", {
      icon: '✨',
      duration: 3000,
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!', {
      icon: '📋',
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="btn btn-ghost btn-sm gap-2 text-white/70 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        <div className="bg-base-100 rounded-3xl shadow-xl overflow-visible mb-8">
          {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              {isEditMode ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    className="input input-bordered w-full bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-3xl md:text-4xl font-extrabold"
                    value={surveyData.name}
                    onChange={(e) => updateSurveyField('name', e.target.value)}
                    placeholder="Survey name..."
                  />
                  <textarea
                    className="textarea textarea-bordered w-full bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg h-20"
                    value={surveyData.description}
                    onChange={(e) => updateSurveyField('description', e.target.value)}
                    placeholder="Survey description..."
                  />
                </div>
              ) : (
                <>
                  <h1 className="font-extrabold text-3xl md:text-4xl mb-2">{surveyData.name}</h1>
                  <p className="text-white/90 text-lg">{surveyData.description}</p>
                </>
              )}
              <div className="flex items-center gap-4 mt-3">
                <span className={`badge ${surveyData.status === 'active' ? 'badge-success' : 'badge-warning'} badge-lg font-semibold`}>
                  {surveyData.status}
                </span>
                <span className="text-sm text-white/80">Created: {new Date(surveyData.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <button 
              onClick={() => setShowShareModal(true)}
              className="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-purple-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              Share Survey
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex gap-2 px-8 pt-6">
            <button
              onClick={() => setActiveTab("questions")}
              className={`px-6 py-3 font-semibold rounded-t-xl transition-all ${
                activeTab === "questions"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              📝 Questions
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={`px-6 py-3 font-semibold rounded-t-xl transition-all ${
                activeTab === "results"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              ✨ Result Experience
            </button>
            <button
              onClick={() => setActiveTab("responses")}
              className={`px-6 py-3 font-semibold rounded-t-xl transition-all relative ${
                activeTab === "responses"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              📊 Responses
              {responseCount > 0 && (
                <span className="ml-2 badge badge-sm bg-pink-500 text-white border-0">
                  {responseCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-6 py-3 font-semibold rounded-t-xl transition-all ${
                activeTab === "settings"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Questions Tab */}
          {activeTab === "questions" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-2xl text-base-content">Survey Questions</h2>
                <div className="flex gap-2">
                  {!isEditMode ? (
                    <button 
                      onClick={() => setIsEditMode(true)}
                      className="btn btn-sm bg-purple-600 text-white hover:bg-purple-700 border-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                      Edit Survey
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={handleCancel}
                        className="btn btn-sm btn-ghost"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn btn-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 transition-transform border-0"
                      >
                        {isSaving ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Save Changes
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* AI Helper text with integrated button - only show in edit mode */}
              {isEditMode && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-1">
                        💡 Pro Tip: Let AI enhance your survey!
                      </p>
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        Click &ldquo;Generate with AI&rdquo; to improve your questions or add new ones. <span className="font-semibold">Don&apos;t worry - your existing questions are safe!</span> You&apos;ll choose whether AI adds new questions or enhances what you already have.
                      </p>
                      <button
                        onClick={() => setShowAIModal(true)}
                        className="mt-3 btn btn-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 hover:from-purple-700 hover:to-indigo-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:rotate-12 transition-transform">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                        Generate with AI
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-6">
                {surveyData.questions.map((q, index) => (
                  <div key={q.id}>
                    <div 
                      draggable={isEditMode}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDragEnter={(e) => handleDragEnter(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      className="relative"
                    >
                      {/* Drop indicator - shows above */}
                      {isEditMode && dragOverIndex === index && draggedIndex !== null && draggedIndex > index && (
                        <div className="absolute -top-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg z-10 animate-pulse"></div>
                      )}
                      
                      <div className={`bg-base-200 rounded-2xl p-6 border-2 transition-all duration-300 ${
                        isEditMode ? 'pointer-events-none' : ''
                      } ${
                        draggedIndex === index 
                          ? 'opacity-50 border-purple-400' 
                          : dragOverIndex === index 
                          ? 'border-purple-400 shadow-xl' 
                          : isEditMode
                          ? 'border-purple-300 hover:shadow-lg'
                          : 'border-transparent hover:border-purple-300'
                      }`}>
                        <div className="flex items-start gap-4">
                          {/* Drag Handle */}
                          {isEditMode && (
                            <div className="cursor-move flex-shrink-0 pt-2 text-base-content/40 hover:text-base-content/70 transition-colors pointer-events-auto" title="Drag to reorder">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="4" cy="4" r="1.5"/>
                                <circle cx="4" cy="12" r="1.5"/>
                                <circle cx="12" cy="4" r="1.5"/>
                                <circle cx="12" cy="12" r="1.5"/>
                              </svg>
                            </div>
                          )}
                          
                          <span className="badge badge-lg bg-purple-600 text-white font-bold">Q{index + 1}</span>
                          
                          <div className="flex-1 space-y-4">
                            {isEditMode ? (
                              <input
                                type="text"
                                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all pointer-events-auto"
                                value={q.title}
                                onChange={(e) => updateQuestion(q.id, 'title', e.target.value)}
                                placeholder="Type your question here..."
                              />
                            ) : (
                              <h3 className="text-lg font-semibold text-base-content">{q.title}</h3>
                            )}
                            
                            <div className="flex items-center gap-2">
                              {isEditMode ? (
                                <select
                                  className="select select-bordered select-sm max-w-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all pointer-events-auto"
                                  value={q.questionType}
                                  onChange={(e) => updateQuestion(q.id, 'questionType', e.target.value)}
                                >
                                  <option value="multiple-choice">Multiple Choice</option>
                                  <option value="text">Text Answer</option>
                                  <option value="rating">Rating Scale</option>
                                </select>
                              ) : (
                                <span className="badge badge-outline">{q.questionType}</span>
                              )}
                            </div>

                            {/* Multiple Choice Options */}
                            {q.questionType === "multiple-choice" && (
                              <div className="space-y-3 pl-4 border-l-2 border-purple-300">
                                {isEditMode && (
                                  <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-base-content/70">Answer Options</label>
                                    <button
                                      type="button"
                                      onClick={() => addOption(q.id)}
                                      className="btn btn-xs btn-ghost text-purple-600 hover:bg-purple-100 pointer-events-auto"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                      </svg>
                                      Add Option
                                    </button>
                                  </div>
                                )}
                                
                                {q.options.map((option, optIndex) => (
                                  <div key={optIndex} className="flex items-center gap-2">
                                    <input 
                                      type="checkbox" 
                                      className="checkbox checkbox-primary checkbox-sm" 
                                      disabled={!isEditMode}
                                    />
                                    {isEditMode ? (
                                      <>
                                        <input
                                          type="text"
                                          className="input input-sm input-bordered flex-1 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all pointer-events-auto"
                                          value={option.text}
                                          onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                                          placeholder={`Option ${optIndex + 1}`}
                                        />
                                        {q.options.length > 1 && (
                                          <button
                                            type="button"
                                            onClick={() => removeOption(q.id, optIndex)}
                                            className="btn btn-xs btn-ghost text-error hover:bg-error/10 pointer-events-auto"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                          </button>
                                        )}
                                      </>
                                    ) : (
                                      <span className="text-base-content/80">{option.text}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Text Answer */}
                            {q.questionType === "text" && (
                              <div className="pl-4 border-l-2 border-purple-300">
                                <div className="bg-base-100 rounded-lg p-3">
                                  <textarea
                                    className="textarea textarea-bordered w-full h-20"
                                    placeholder="Respondents will type their answer here..."
                                    disabled
                                  />
                                  <p className="text-xs text-base-content/50 mt-2 italic">Preview: Text input field for open-ended responses</p>
                                </div>
                              </div>
                            )}

                            {/* Rating Scale */}
                            {q.questionType === "rating" && (
                              <div className="pl-4 border-l-2 border-purple-300">
                                <div className="bg-base-100 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-base-content/70">1 - Poor</span>
                                    <span className="text-sm text-base-content/70">5 - Excellent</span>
                                  </div>
                                  <div className="flex gap-2 justify-center">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                      <button
                                        key={rating}
                                        type="button"
                                        className="btn btn-circle btn-outline btn-lg"
                                        disabled
                                      >
                                        {rating}
                                      </button>
                                    ))}
                                  </div>
                                  <p className="text-xs text-base-content/50 mt-2 italic text-center">Preview: 1-5 rating scale</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Delete Question Button */}
                          {isEditMode && surveyData.questions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuestion(q.id)}
                              className="btn btn-sm btn-ghost text-error hover:bg-error/10 pointer-events-auto"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Drop indicator - shows below */}
                      {isEditMode && dragOverIndex === index && draggedIndex !== null && draggedIndex < index && (
                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg z-10 animate-pulse"></div>
                      )}
                    </div>

                    {/* Add Question Button */}
                    {isEditMode && index === surveyData.questions.length - 1 && (
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="mt-4 w-full btn btn-outline btn-primary hover:scale-105 transition-all duration-300 border-2 border-dashed hover:border-solid group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Another Question
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Responses Tab */}
          {activeTab === "responses" && (
            <ResponsesTab surveyId={surveyData._id} onResponsesLoad={setResponseCount} />
          )}

          {/* Result Experience Tab */}
          {activeTab === "results" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-2xl text-base-content">Result Experience</h2>
                  <p className="text-base-content/60 text-sm mt-1">Customize what users see after completing your survey</p>
                </div>
                <div className="flex gap-2">
                  {!isEditMode ? (
                    <button 
                      onClick={() => setIsEditMode(true)}
                      className="btn btn-sm bg-purple-600 text-white hover:bg-purple-700 border-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                      Edit Results
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={handleCancel}
                        className="btn btn-sm btn-ghost"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn btn-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 transition-transform border-0"
                      >
                        {isSaving ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Save Changes
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>


              {/* Result Components Section */}
              {(
                <div className="space-y-6">
                  {isEditMode ? (
                    // Edit Mode - Show Component Library + Added Components
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Component Library */}
                      <ComponentLibrary 
                        resultComponents={surveyData.resultExperience.components}
                        onAddComponent={addResultComponent}
                      />

                      {/* Added Components */}
                      <div className="lg:col-span-1">
                        <h3 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                          <span>📋</span>
                          Added Components ({surveyData.resultExperience.components.length})
                        </h3>
                        {surveyData.resultExperience.components.length === 0 ? (
                          <div className="bg-base-200 rounded-xl p-8 text-center border-2 border-dashed border-base-300">
                            <span className="text-4xl mb-2 block">👈</span>
                            <p className="text-base-content/60 text-sm">
                              Add components from the library to customize your result experience
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {surveyData.resultExperience.components
                              .sort((a, b) => a.order - b.order)
                              .map((comp) => {
                                const compInfo = availableComponents.find(c => c.type === comp.type);
                                return (
                                  <div
                                    key={comp.id}
                                    className="bg-base-200 rounded-xl p-4 border-2 border-primary/30 hover:border-primary/60 transition-all"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-2xl">{compInfo?.icon}</span>
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-sm">{compInfo?.title}</h4>
                                        <p className="text-xs text-base-content/50">Order: {comp.order + 1}</p>
                                      </div>
                                      <button
                                        onClick={() => removeResultComponent(comp.id)}
                                        className="btn btn-xs btn-ghost text-error hover:bg-error/10"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // View Mode - Show Component Previews Only
                    <div>
                      <h3 className="font-semibold text-base-content mb-3 text-lg">
                        Preview
                      </h3>
                      {surveyData.resultExperience.components.length === 0 ? (
                        <div className="bg-base-200 rounded-xl p-12 text-center border-2 border-dashed border-base-300">
                          <span className="text-6xl mb-4 block">📭</span>
                          <p className="text-base-content/60 text-lg font-semibold mb-2">
                            No components added yet
                          </p>
                          <p className="text-base-content/50 text-sm">
                            Click &quot;Edit Results&quot; to add components to your result experience
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {surveyData.resultExperience.components
                            .sort((a, b) => a.order - b.order)
                            .map((comp) => (
                              <div key={comp.id}>
                                {comp.type === 'ai-avatar' && (
                                  <AIAvatarComponent
                                    comp={comp}
                                    updateComponentConfig={() => {}}
                                    removeComponent={() => {}}
                                  />
                                )}
                                {comp.type === 'ai-custom' && (
                                  <AICustomComponent
                                    comp={comp}
                                    updateComponentConfig={() => {}}
                                    removeComponent={() => {}}
                                  />
                                )}
                                {comp.type === 'custom-message' && (
                                  <div className="bg-base-200 rounded-2xl p-8 border-2 border-base-300 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                      <span className="text-3xl">💬</span>
                                      <h4 className="font-semibold text-lg">Custom Message</h4>
                                    </div>
                                    <p className="text-base-content/80">{comp.config.message || 'No message set'}</p>
                                  </div>
                                )}
                                {comp.type === 'discount-code' && (
                                  <div className="bg-base-200 rounded-2xl p-8 border-2 border-base-300 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                      <span className="text-3xl">🎁</span>
                                      <h4 className="font-semibold text-lg">Discount Code</h4>
                                    </div>
                                    <div className="bg-base-300 rounded-lg p-4 inline-block">
                                      <code className="text-xl font-bold">{comp.config.code || 'SURVEY20'}</code>
                                    </div>
                                    <p className="text-base-content/70 mt-3">{comp.config.message || 'Get 20% off your next purchase!'}</p>
                                  </div>
                                )}
                                {comp.type === 'cta-button' && (
                                  <div className="bg-base-200 rounded-2xl p-8 border-2 border-base-300 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                      <span className="text-3xl">🔗</span>
                                      <h4 className="font-semibold text-lg">Call-to-Action Button</h4>
                                    </div>
                                    <button className="btn btn-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                                      {comp.config.buttonText || 'Visit Website'}
                                    </button>
                                    <p className="text-sm text-base-content/50 mt-3">{comp.config.buttonUrl || 'https://example.com'}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Component Configuration */}
                  {isEditMode && surveyData.resultExperience.components.length > 0 && (
                    <div className="space-y-6">
                      <div className="divider">
                        <span className="text-base-content/60 text-sm font-semibold">Configure Components</span>
                      </div>
                      
                      {surveyData.resultExperience.components
                        .sort((a, b) => a.order - b.order)
                        .map((comp) => (
                          <div key={comp.id}>
                            {comp.type === 'ai-avatar' && (
                              <AIAvatarComponent
                                comp={comp}
                                updateComponentConfig={updateComponentConfig}
                                removeComponent={removeResultComponent}
                              />
                            )}
                            {comp.type === 'ai-custom' && (
                              <AICustomComponent
                                comp={comp}
                                updateComponentConfig={updateComponentConfig}
                                removeComponent={removeResultComponent}
                              />
                            )}
                            {comp.type === 'custom-message' && (
                              <div className="relative group">
                                <div className="bg-base-200 rounded-2xl p-6 border-2 border-base-300 hover:border-primary/40 transition-all">
                                  <button
                                    onClick={() => removeResultComponent(comp.id)}
                                    className="absolute top-3 right-3 btn btn-xs btn-circle bg-red-500/80 hover:bg-red-500 border-0 text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                                  >
                                    ✕
                                  </button>
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                      <span className="text-2xl">💬</span>
                                      <h4 className="font-semibold">Custom Message</h4>
                                    </div>
                                    <textarea
                                      className="textarea textarea-bordered w-full min-h-[100px]"
                                      value={comp.config.message || ''}
                                      onChange={(e) => updateComponentConfig(comp.id, 'message', e.target.value)}
                                      placeholder="Enter your custom message..."
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                            {comp.type === 'discount-code' && (
                              <div className="relative group">
                                <div className="bg-base-200 rounded-2xl p-6 border-2 border-base-300 hover:border-primary/40 transition-all">
                                  <button
                                    onClick={() => removeResultComponent(comp.id)}
                                    className="absolute top-3 right-3 btn btn-xs btn-circle bg-red-500/80 hover:bg-red-500 border-0 text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                                  >
                                    ✕
                                  </button>
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                      <span className="text-2xl">🎁</span>
                                      <h4 className="font-semibold">Discount Code</h4>
                                    </div>
                                    <div>
                                      <label className="label">
                                        <span className="label-text">Discount Code</span>
                                      </label>
                                      <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={comp.config.code || ''}
                                        onChange={(e) => updateComponentConfig(comp.id, 'code', e.target.value)}
                                        placeholder="SURVEY20"
                                      />
                                    </div>
                                    <div>
                                      <label className="label">
                                        <span className="label-text">Message</span>
                                      </label>
                                      <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={comp.config.message || ''}
                                        onChange={(e) => updateComponentConfig(comp.id, 'message', e.target.value)}
                                        placeholder="Get 20% off your next purchase!"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {comp.type === 'cta-button' && (
                              <div className="relative group">
                                <div className="bg-base-200 rounded-2xl p-6 border-2 border-base-300 hover:border-primary/40 transition-all">
                                  <button
                                    onClick={() => removeResultComponent(comp.id)}
                                    className="absolute top-3 right-3 btn btn-xs btn-circle bg-red-500/80 hover:bg-red-500 border-0 text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                                  >
                                    ✕
                                  </button>
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                      <span className="text-2xl">🔗</span>
                                      <h4 className="font-semibold">Call-to-Action Button</h4>
                                    </div>
                                    <div>
                                      <label className="label">
                                        <span className="label-text">Button Text</span>
                                      </label>
                                      <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={comp.config.buttonText || ''}
                                        onChange={(e) => updateComponentConfig(comp.id, 'buttonText', e.target.value)}
                                        placeholder="Visit Website"
                                      />
                                    </div>
                                    <div>
                                      <label className="label">
                                        <span className="label-text">Button URL</span>
                                      </label>
                                      <input
                                        type="url"
                                        className="input input-bordered w-full"
                                        value={comp.config.buttonUrl || ''}
                                        onChange={(e) => updateComponentConfig(comp.id, 'buttonUrl', e.target.value)}
                                        placeholder="https://example.com"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-8">
              <h2 className="font-bold text-2xl text-base-content">Survey Settings</h2>

              {/* Response Settings */}
              <div className="space-y-6">
                <h3 className="font-semibold text-xl text-base-content flex items-center gap-2">
                  <span>⚙️</span>
                  Response Settings
                </h3>
                
                <div className="bg-base-200 rounded-2xl p-6 space-y-6">
                  {/* Show Mutual Connections */}
                  <div className="space-y-3">
                    <div className="form-control">
                      <label className="label cursor-pointer justify-start gap-4">
                        <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="label-text font-semibold block">Show Mutual Connections</span>
                            <div className="tooltip" data-tip="Help respondents feel connected by showing shared answers">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-base-content/50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                              </svg>
                            </div>
                          </div>
                          <span className="label-text-alt text-base-content/60">Display shared interests at the end of the survey to create connections</span>
                        </div>
                      </label>
                    </div>
                    
                    {/* Example Preview */}
                    <div className="ml-14 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-300/30">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">✨</div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-base-content mb-2">Preview: How it appears to respondents</p>
                          <div className="bg-base-100 rounded-lg p-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">S</div>
                              <span className="text-base-content/80">Sarah also picked <span className="font-semibold text-purple-600">Ice cream</span> 🍦</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">M</div>
                              <span className="text-base-content/80">Mike also loves <span className="font-semibold text-purple-600">Outdoor adventures</span> 🏔️</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
                              <span className="text-base-content/80">Alex chose <span className="font-semibold text-purple-600">Flying</span> too ✈️</span>
                            </div>
                          </div>
                          <p className="text-xs text-base-content/50 mt-2 italic">💡 Shows 3-5 people with matching answers to help build connections</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="divider"></div>

                  {/* Authentication Settings */}
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-4">
                      <input type="checkbox" className="toggle toggle-primary" />
                      <div>
                        <span className="label-text font-semibold block">Require Login</span>
                        <span className="label-text-alt text-base-content/60">Users must sign in to complete the survey. When disabled, responses are anonymous.</span>
                      </div>
                    </label>
                  </div>

                  <div className="divider"></div>

                  {/* Survey Status */}
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-4">
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary" 
                        checked={surveyData.status === 'active'}
                        onChange={(e) => updateSurveyField('status', e.target.checked ? 'active' : 'inactive')}
                      />
                      <div>
                        <span className="label-text font-semibold block">Survey Active</span>
                        <span className="label-text-alt text-base-content/60">Allow new responses to be submitted</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Share Settings */}
              <div className="space-y-6">
                <h3 className="font-semibold text-xl text-base-content flex items-center gap-2">
                  <span>🔗</span>
                  Share & Embed
                </h3>
                
                <div className="bg-base-200 rounded-2xl p-6 space-y-6">
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Survey Link</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="input input-bordered flex-1"
                        value={`${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://getquizzy.com'}/b/${surveyData._id}`}
                        readOnly
                      />
                      <button 
                        onClick={() => copyToClipboard(`${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://getquizzy.com'}/b/${surveyData._id}`)}
                        className="btn btn-primary"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                        </svg>
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="divider"></div>

                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Embed Code</span>
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <textarea
                          className="textarea textarea-bordered w-full h-20 font-mono text-sm"
                          value={`<iframe src="${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://getquizzy.com'}/b/${surveyData._id}" width="100%" height="600" frameborder="0"></iframe>`}
                          readOnly
                        />
                        <button 
                          onClick={() => copyToClipboard(`<iframe src="${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://getquizzy.com'}/b/${surveyData._id}" width="100%" height="600" frameborder="0"></iframe>`)}
                          className="btn btn-primary"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                          </svg>
                          Copy
                        </button>
                      </div>
                      
                      {/* Embed Preview */}
                      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-300/30">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-base-content flex items-center gap-2">
                            <span className="text-lg">👁️</span>
                            Preview: How it looks on your website
                          </p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-4 relative overflow-hidden">
                          {/* Browser mockup */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="flex-1 bg-gray-800 rounded px-3 py-1 text-xs text-gray-400 font-mono">
                              yourwebsite.com
                            </div>
                          </div>
                          {/* Website layout with embedded survey */}
                          <div className="bg-white rounded-lg p-4 flex gap-4">
                            {/* Left side - Your website content */}
                            <div className="flex-1 space-y-3">
                              <div className="bg-gray-200 rounded-lg p-4 space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                              </div>
                              <div className="text-center py-8 text-gray-400 text-sm font-semibold border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                                Your Website Content
                              </div>
                              <div className="bg-gray-200 rounded-lg p-4 space-y-2">
                                <div className="h-3 bg-gray-300 rounded w-full"></div>
                                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                                <div className="h-3 bg-gray-300 rounded w-4/6"></div>
                              </div>
                            </div>

                            {/* Right side - Embedded survey */}
                            <div className="w-80 flex-shrink-0">
                              <div className="bg-[#1a1f3a] rounded-xl p-4 shadow-lg border border-gray-700">
                                {/* Survey Header */}
                                <div className="mb-4">
                                  <h3 className="text-white font-bold text-base mb-2 flex items-center gap-1">
                                    {surveyData.name} ✨
                                  </h3>
                                  {/* Progress bar */}
                                  <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full" style={{ width: '20%' }}></div>
                                  </div>
                                </div>

                                {/* Question */}
                                <div className="space-y-3">
                                  <h4 className="text-white text-sm font-semibold leading-tight">
                                    If you were a superhero, what would your power be?
                                  </h4>

                                  {/* Answer Options */}
                                  <div className="space-y-2">
                                    <button className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-left text-xs transition-all duration-200">
                                      Invisibility (ninja mode)
                                    </button>
                                    <button className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-left text-xs transition-all duration-200">
                                      Flying (bye bye traffic)
                                    </button>
                                    <button className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-left text-xs transition-all duration-200">
                                      Mind Reading
                                    </button>
                                    <button className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-left text-xs transition-all duration-200">
                                      Time Control
                                    </button>
                                  </div>

                                  {/* Navigation */}
                                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700">
                                    <button className="px-3 py-1 bg-gray-800 text-gray-400 rounded text-xs font-semibold">
                                      ← Back
                                    </button>
                                    <span className="text-gray-400 text-xs">Q 1/5</span>
                                    <button className="px-3 py-1 bg-gray-700 text-gray-400 rounded text-xs font-semibold">
                                      Next →
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-base-content/50 mt-2 italic">💡 The survey will be embedded seamlessly on your website with full interactivity</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="space-y-6">
                <h3 className="font-semibold text-xl text-error flex items-center gap-2">
                  <span>⚠️</span>
                  Danger Zone
                </h3>
                
                <div className="bg-error/10 border-2 border-error/30 rounded-2xl p-6 space-y-4">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <h4 className="font-semibold text-base-content mb-1">Delete Survey</h4>
                      <p className="text-sm text-base-content/70">Once you delete this survey, there is no going back. This will permanently delete all questions and responses.</p>
                    </div>
                    <ButtonDeleteSurvey surveyId={surveyData._id} surveyName={surveyData.name} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-base-100 rounded-3xl shadow-2xl max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
                <span className="text-3xl">🔗</span>
                Share Survey
              </h2>
              <button 
                onClick={() => setShowShareModal(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Survey Link</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered flex-1"
                    value={`${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://getquizzy.com'}/b/${surveyData._id}`}
                    readOnly
                  />
                  <button 
                    onClick={() => {
                      copyToClipboard(`${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://getquizzy.com'}/b/${surveyData._id}`);
                      // Optional: Show a success message
                    }}
                    className="btn bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 hover:scale-105 transition-transform"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                    Copy
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-base-content/80">
                  <span className="font-semibold">💡 Tip:</span> Share this link on social media, email, or anywhere you want to collect responses!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Generation Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAIModal(false)}>
          <div className="bg-base-100 rounded-3xl shadow-2xl max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
                <span className="text-3xl">✨</span>
                AI Question Generator
              </h2>
              <button 
                onClick={() => setShowAIModal(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Reassurance Message */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                      🛡️ Your questions are safe!
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Don&apos;t worry - AI won&apos;t delete anything you&apos;ve created. Choose how you want AI to help below.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mode Selection */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-base-content">How should AI help you?</label>
                
                <div className="space-y-4">
                  {/* Add New Questions */}
                  <label className="cursor-pointer block">
                    <div className={`border-2 rounded-xl p-4 transition-all ${
                      aiGenerationMode === "add" 
                        ? "border-purple-500 bg-purple-500/10" 
                        : "border-gray-300 dark:border-gray-700 hover:border-purple-300"
                    }`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="ai-mode"
                          value="add"
                          checked={aiGenerationMode === "add"}
                          onChange={(e) => setAiGenerationMode(e.target.value)}
                          className="radio radio-primary mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-base-content mb-1">➕ Add New Questions</div>
                          <p className="text-sm text-base-content/70">
                            AI will generate {surveyData.questions.length > 0 ? 'additional' : ''} questions based on your survey name and description. Your existing {surveyData.questions.length} question{surveyData.questions.length !== 1 ? 's' : ''} will remain unchanged.
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Enhance Existing */}
                  <label className="cursor-pointer block">
                    <div className={`border-2 rounded-xl p-4 transition-all ${
                      aiGenerationMode === "edit" 
                        ? "border-purple-500 bg-purple-500/10" 
                        : "border-gray-300 dark:border-gray-700 hover:border-purple-300"
                    }`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="ai-mode"
                          value="edit"
                          checked={aiGenerationMode === "edit"}
                          onChange={(e) => setAiGenerationMode(e.target.value)}
                          className="radio radio-primary mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-base-content mb-1">✨ Enhance Existing Questions</div>
                          <p className="text-sm text-base-content/70">
                            AI will improve your current {surveyData.questions.length} question{surveyData.questions.length !== 1 ? 's' : ''} by making them more engaging, clear, and fun while keeping your original intent.
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Survey Context Display */}
              <div className="bg-base-200 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-base-content/70 uppercase tracking-wide">AI will use this context:</p>
                <div className="space-y-1">
                  <p className="text-sm"><span className="font-semibold">Survey:</span> {surveyData.name}</p>
                  <p className="text-sm text-base-content/70">{surveyData.description}</p>
                  <p className="text-xs text-base-content/60 mt-2">Current questions: {surveyData.questions.length}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAIModal(false)}
                  className="btn btn-ghost flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAIGenerate}
                  className="btn bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 hover:scale-105 transition-all flex-1 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:rotate-12 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  {aiGenerationMode === "add" ? "Add AI Questions" : "Enhance with AI"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminSurvey;
