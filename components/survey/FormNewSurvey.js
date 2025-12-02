"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import ButtonCreateSurvey from "./ButtonCreateSurvey";

const FormNewSurvey = () => {
  // Wizard step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  //To store the name of the survey
  const [name, setName] = useState("");
  //Store the description of the survey
  const [description, setDescription] = useState("");
  // To store the status of the survey
  const [status, setStatus] = useState("active");
  // To store survey questions
  const [questions, setQuestions] = useState([
    { id: 1, title: "", questionType: "multiple-choice", options: [{ text: "", value: "" }], required: false }
  ]);
  // Result Experience Components
  const [resultComponents, setResultComponents] = useState([
    { id: 1, type: 'ai-avatar', enabled: true, order: 1, config: { showPersonality: true } }
  ]);
  // To store drag state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  // Validation errors
  const [errors, setErrors] = useState({});

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), title: "", questionType: "multiple-choice", options: [{ text: "", value: "" }], required: false }
    ]);
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
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Only clear if we're actually leaving this element
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
    
    // Use the stored draggedIndex from state
    const actualDragIndex = draggedIndex;
    
    console.log('Drop event - actualDragIndex:', actualDragIndex, 'dropIndex:', dropIndex);
    
    if (actualDragIndex === null || actualDragIndex === dropIndex) {
      setDragOverIndex(null);
      return;
    }
    
    // Create a new array and perform the reorder
    const newQuestions = [...questions];
    
    console.log('Before reorder:', newQuestions.map((q, i) => `${i}: ${q.question || 'Q'+(i+1)}`));
    
    // Remove the dragged item from its original position
    const [draggedItem] = newQuestions.splice(actualDragIndex, 1);
    
    console.log('After removal:', newQuestions.map((q, i) => `${i}: ${q.question || 'Q'+(i+1)}`));
    
    // Calculate where to insert
    let insertIndex;
    if (actualDragIndex < dropIndex) {
      // Dragging DOWN: line appears BELOW the target
      // We want to insert AFTER the target, but target has shifted down by 1 after removal
      // So dropIndex (which pointed to target) now points to the position after target
      // Insert at dropIndex will put it after the original target position
      insertIndex = dropIndex;
    } else {
      // Dragging UP: line appears ABOVE the target  
      // We want to insert BEFORE the target
      // dropIndex points to target and hasn't shifted, so insert at dropIndex
      insertIndex = dropIndex;
    }
    
    console.log('Inserting at index:', insertIndex);
    
    newQuestions.splice(insertIndex, 0, draggedItem);
    
    console.log('After insertion:', newQuestions.map((q, i) => `${i}: ${q.title || 'Q'+(i+1)}`));
    
    setQuestions(newQuestions);
    setDragOverIndex(null);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const addOption = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, { text: "", value: "" }] } : q
      )
    );
  };

  const removeOption = (questionId, optionIndex) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
          : q
      )
    );
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === optionIndex ? { text: value, value: value.toLowerCase().replace(/\s+/g, '-') } : opt
              ),
            }
          : q
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form
        className="bg-base-100 rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-8 text-white">
          <h1 className="font-extrabold text-3xl md:text-4xl mb-2">Create Your Survey</h1>
          <p className="text-white/90 text-lg">Build an engaging survey with AI-powered character rewards</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Survey Details Section */}
          <div className="space-y-6">
            <h2 className="font-bold text-2xl text-base-content flex items-center gap-2">
              <span className="text-3xl">📋</span>
              Survey Details
            </h2>
            
            <div className="space-y-4">
              <fieldset className="space-y-2">
                <label className="font-semibold text-base-content">Survey Name</label>
                <input
                  required
                  type="text"
                  className={`input input-bordered w-full focus:outline-none focus:ring-2 transition-all ${
                    errors.name ? 'border-error focus:ring-error' : 'focus:ring-purple-500'
                  }`}
                  placeholder="e.g., What's Your Personality Type?"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (errors.name) {
                      const newErrors = { ...errors };
                      delete newErrors.name;
                      setErrors(newErrors);
                    }
                  }}
                />
                {errors.name && (
                  <div className="flex items-start gap-2 text-error text-sm mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mt-0.5 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <span>{errors.name}</span>
                  </div>
                )}
              </fieldset>

              <fieldset className="space-y-2">
                <label className="font-semibold text-base-content">Description</label>
                <textarea
                  required
                  className={`textarea textarea-bordered w-full h-24 focus:outline-none focus:ring-2 transition-all ${
                    errors.description ? 'border-error focus:ring-error' : 'focus:ring-purple-500'
                  }`}
                  placeholder="Brief description of your survey..."
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    if (errors.description) {
                      const newErrors = { ...errors };
                      delete newErrors.description;
                      setErrors(newErrors);
                    }
                  }}
                />
                {errors.description && (
                  <div className="flex items-start gap-2 text-error text-sm mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mt-0.5 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <span>{errors.description}</span>
                  </div>
                )}
              </fieldset>

              
            </div>
          </div>

          {/* Divider */}
          <div className="divider"></div>

          {/* Questions Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="font-bold text-2xl text-base-content flex items-center gap-2">
                <span className="text-3xl">❓</span>
                Survey Questions
              </h2>
              
              {/* AI Generate Button */}
              <button
                type="button"
                onClick={() => {
                  // TODO: Implement AI question generation
                  toast.info("AI question generation coming soon!");
                }}
                className="btn btn-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:rotate-12 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Generate with AI
              </button>
            </div>

            {/* Helper text for AI generation */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-1">
                    💡 Pro Tip: Let AI do the work!
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Click &ldquo;Generate with AI&rdquo; to automatically create relevant questions based on your survey name and description. You can always edit them afterwards!
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {questions.map((q, qIndex) => (
                <div key={q.id}>
                  <div 
                    draggable
                    onDragStart={(e) => handleDragStart(e, qIndex)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, qIndex)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, qIndex)}
                    className="relative"
                  >
                    {/* Drop indicator - shows above */}
                    {dragOverIndex === qIndex && draggedIndex !== null && draggedIndex > qIndex && (
                      <div className="absolute -top-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg z-10 animate-pulse"></div>
                    )}
                    
                    <div className={`bg-base-200 rounded-2xl p-6 space-y-4 hover:shadow-lg transition-all duration-300 border-2 pointer-events-none ${
                      draggedIndex === qIndex 
                        ? 'opacity-50 border-purple-400' 
                        : dragOverIndex === qIndex 
                        ? 'border-purple-400 shadow-xl' 
                        : 'border-transparent hover:border-purple-200'
                    }`}>
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-4">
                      {/* Drag Handle */}
                      <div className="cursor-move flex-shrink-0 pt-2 text-base-content/40 hover:text-base-content/70 transition-colors" title="Drag to reorder">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="4" cy="4" r="1.5"/>
                          <circle cx="4" cy="12" r="1.5"/>
                          <circle cx="12" cy="4" r="1.5"/>
                          <circle cx="12" cy="12" r="1.5"/>
                        </svg>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="badge badge-lg bg-purple-600 text-white font-bold">Q{qIndex + 1}</span>
                        </div>
                        
                        <input
                          type="text"
                          className={`input input-bordered w-full focus:outline-none focus:ring-2 transition-all pointer-events-auto ${
                            errors[`question_${qIndex}_title`] ? 'border-error focus:ring-error' : 'focus:ring-purple-500'
                          }`}
                          placeholder="Type your question here..."
                          value={q.title}
                          onChange={(e) => {
                            updateQuestion(q.id, "title", e.target.value);
                            if (errors[`question_${qIndex}_title`]) {
                              const newErrors = { ...errors };
                              delete newErrors[`question_${qIndex}_title`];
                              setErrors(newErrors);
                            }
                          }}
                        />
                        {errors[`question_${qIndex}_title`] && (
                          <div className="flex items-start gap-2 text-error text-sm mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mt-0.5 flex-shrink-0">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            <span>{errors[`question_${qIndex}_title`]}</span>
                          </div>
                        )}

                        <select
                          className="select select-bordered w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all pointer-events-auto"
                          value={q.questionType}
                          onChange={(e) => updateQuestion(q.id, "questionType", e.target.value)}
                        >
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="text">Text Answer</option>
                          <option value="rating">Rating Scale</option>
                        </select>
                      </div>

                      {questions.length > 1 && (
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

                    {/* Options for Multiple Choice */}
                    {q.questionType === "multiple-choice" && (
                      <div className="space-y-3 pl-4 border-l-2 border-purple-300">
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
                        
                        {q.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <span className="text-base-content/50 font-medium min-w-[2rem]">{String.fromCharCode(65 + optIndex)}.</span>
                            <input
                              type="text"
                              className="input input-sm input-bordered flex-1 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all pointer-events-auto"
                              placeholder={`Option ${optIndex + 1}`}
                              value={option.text}
                              onChange={(e) => {
                                updateOption(q.id, optIndex, e.target.value);
                                if (errors[`question_${qIndex}_options`]) {
                                  const newErrors = { ...errors };
                                  delete newErrors[`question_${qIndex}_options`];
                                  setErrors(newErrors);
                                }
                              }}
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
                          </div>
                        ))}
                        {errors[`question_${qIndex}_options`] && (
                          <div className="flex items-start gap-2 text-error text-sm mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mt-0.5 flex-shrink-0">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            <span>{errors[`question_${qIndex}_options`]}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Drop indicator - shows below (but before the Add Question button) */}
                  {dragOverIndex === qIndex && draggedIndex !== null && draggedIndex < qIndex && (
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg z-10 animate-pulse"></div>
                  )}
                  </div>

                  {/* Add Question Button - appears after each question */}
                  {qIndex === questions.length - 1 && (
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

          {/* Validation Warning */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-error/10 border border-error/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-error flex-shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <div className="flex-1">
                  <p className="font-semibold text-error mb-1">Please fix the errors above</p>
                  <p className="text-sm text-error/80">All required fields must be properly filled before creating your survey.</p>
                </div>
              </div>
            </div>
          )}

          {Object.keys(errors).length === 0 && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-purple-300">Please fill in all required fields above before proceeding to create your survey.</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <ButtonCreateSurvey 
            surveyData={{
              name,
              description,
              status,
              questions: questions.map((q, index) => ({
                // Don't include client-side id - MongoDB will generate ObjectIds
                title: q.title,
                questionType: q.questionType,
                options: q.questionType === "multiple-choice" ? q.options : [],
                required: q.required || false,
                order: index
              }))
            }}
            setErrors={setErrors}
          />
        </div>
      </form>
    </div>
  );
};

export default FormNewSurvey;
