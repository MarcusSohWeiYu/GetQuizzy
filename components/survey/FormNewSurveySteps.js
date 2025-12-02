"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import ButtonCreateSurvey from "./ButtonCreateSurvey";
import Image from "next/image";

const FormNewSurveySteps = () => {
  // Wizard step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Step 1: Basic Info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Step 2: Questions
  const [questions, setQuestions] = useState([
    { id: 1, title: "", questionType: "multiple-choice", options: [{ text: "", value: "" }], required: false }
  ]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Step 3: Result Experience
  const [resultComponents, setResultComponents] = useState([]);

  // Validation
  const [errors, setErrors] = useState({});

  // Available components library
  const availableComponents = [
    {
      type: 'ai-avatar',
      icon: '🤖',
      title: 'AI Avatar & Personality',
      description: 'Generate a unique character based on survey answers',
      badge: 'Popular',
      limit: 1
    },
    {
      type: 'ai-custom',
      icon: '✨',
      title: 'Custom AI Section',
      description: 'Generate any AI-powered content: personality traits, career advice, product recommendations, learning paths, etc.',
      limit: null
    },
    {
      type: 'custom-message',
      icon: '💬',
      title: 'Custom Message',
      description: 'Display a personalized thank you message',
      limit: null
    },
    {
      type: 'discount-code',
      icon: '🎁',
      title: 'Discount Code',
      description: 'Reward respondents with a discount or promo code',
      limit: null
    },
    {
      type: 'cta-button',
      icon: '🔗',
      title: 'Call-to-Action Button',
      description: 'Direct users to your website or product',
      limit: null
    },
    {
      type: 'social-share',
      icon: '📱',
      title: 'Social Share Buttons',
      description: 'Let users share their results on social media',
      limit: 1
    }
  ];

  // Question handlers
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), title: "", questionType: "multiple-choice", options: [{ text: "", value: "" }], required: false }
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) {
      toast.error("You must have at least one question");
      return;
    }
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);

    // Clear error for this field
    const errorKey = `question_${index}_${field}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ text: "", value: "" });
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options.length === 1) {
      toast.error("Must have at least one option");
      return;
    }
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = { 
      text: value, 
      value: value.toLowerCase().replace(/\s+/g, '-') 
    };
    setQuestions(newQuestions);

    // Clear error
    const errorKey = `question_${questionIndex}_options`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  // Drag and drop handlers
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
    
    const newQuestions = [...questions];
    const [draggedItem] = newQuestions.splice(actualDragIndex, 1);
    
    let insertIndex;
    if (actualDragIndex < dropIndex) {
      insertIndex = dropIndex;
    } else {
      insertIndex = dropIndex;
    }
    
    newQuestions.splice(insertIndex, 0, draggedItem);
    setQuestions(newQuestions);
    setDragOverIndex(null);
  };

  // Component handlers
  const addComponent = (componentType) => {
    const componentInfo = availableComponents.find(c => c.type === componentType);
    
    // Check limit for components that have restrictions
    if (componentInfo.limit) {
      const existingCount = resultComponents.filter(c => c.type === componentType).length;
      if (existingCount >= componentInfo.limit) {
        toast.error(`You can only add ${componentInfo.limit} ${componentInfo.title}`);
        return;
      }
    }

    const newComponent = {
      id: Date.now(),
      type: componentType,
      order: resultComponents.length + 1,
      config: getDefaultConfig(componentType)
    };

    setResultComponents([...resultComponents, newComponent]);
    toast.success("Component added!");
  };

  const removeComponent = (componentId) => {
    setResultComponents(resultComponents.filter(c => c.id !== componentId));
    toast.success("Component removed!");
  };

  const updateComponentConfig = (componentId, configKey, value) => {
    setResultComponents(resultComponents.map(c => 
      c.id === componentId 
        ? { ...c, config: { ...c.config, [configKey]: value } }
        : c
    ));
  };

  const getDefaultConfig = (type) => {
    switch(type) {
      case 'ai-avatar':
        return { showPersonality: true, style: 'animated' };
      case 'ai-custom':
        return { 
          title: 'Your Personality Insights',
          prompt: 'Based on the user\'s answers, generate their strengths and weaknesses',
          sections: ['Strengths', 'Weaknesses']
        };
      case 'custom-message':
        return { message: 'Thank you for completing our survey!' };
      case 'discount-code':
        return { code: 'SURVEY20', message: '20% off your next purchase', expiryDays: 30 };
      case 'cta-button':
        return { buttonText: 'Visit Website', buttonUrl: '', style: 'primary' };
      case 'social-share':
        return { message: 'Check out my results!' };
      default:
        return {};
    }
  };

  // Step validation
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!name.trim()) newErrors.name = "Survey name is required";
      if (!description.trim()) newErrors.description = "Description is required";
    }

    if (step === 2) {
      questions.forEach((q, index) => {
        if (!q.title.trim()) {
          newErrors[`question_${index}_title`] = "Question title is required";
        }
        if (q.questionType === "multiple-choice") {
          const hasEmptyOptions = q.options.some(opt => !opt.text.trim() || !opt.value.trim());
          if (hasEmptyOptions) {
            newErrors[`question_${index}_options`] = "All options must have text and value";
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error("Please fix the errors before continuing");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Enhanced Progress Steps */}
      <div className="mb-20">
        {/* Step indicators */}
        <div className="relative flex items-center justify-between">
          {/* Background progress line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-base-300 rounded-full" style={{ zIndex: 0 }} />
          
          {/* Active progress line */}
          <div 
            className="absolute top-5 left-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full transition-all duration-500 ease-in-out"
            style={{ 
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
              zIndex: 1
            }}
          />

          {/* Step circles */}
          {[1, 2, 3].map((step) => {
            const isActive = step === currentStep;
            const isCompleted = step < currentStep;
            
            return (
              <div key={step} className="relative flex flex-col items-center" style={{ zIndex: 2 }}>
                {/* Circle */}
                <div className={`
                  flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg
                  transition-all duration-300 shadow-lg
                  ${isActive 
                    ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white scale-110 shadow-purple-500/50 ring-4 ring-purple-200 dark:ring-purple-900' 
                    : isCompleted
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white scale-100 shadow-green-500/30'
                    : 'bg-base-200 text-base-content/40 scale-90 border-2 border-base-300'
                  }
                `}>
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>

                {/* Label */}
                <div className="absolute top-14 flex flex-col items-center w-32 text-center">
                  <p className={`text-sm font-bold transition-colors ${
                    isActive ? 'text-purple-600 dark:text-purple-400' : 'text-base-content/60'
                  }`}>
                    {step === 1 && 'Basic Info'}
                    {step === 2 && 'Questions'}
                    {step === 3 && 'Result Experience'}
                  </p>
                  {isActive && (
                    <div className="mt-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Current</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-base-200 rounded-2xl p-8 min-h-[500px]">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-base-content mb-2">Survey Details</h2>
              <p className="text-base-content/60">Let&apos;s start with the basics</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Survey Name *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Customer Satisfaction Survey"
                  className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      const newErrors = { ...errors };
                      delete newErrors.name;
                      setErrors(newErrors);
                    }
                  }}
                />
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.name}
                    </span>
                  </label>
                )}
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Description *</span>
                </label>
                <textarea
                  placeholder="Describe what your survey is about..."
                  className={`textarea textarea-bordered w-full h-32 ${errors.description ? 'textarea-error' : ''}`}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) {
                      const newErrors = { ...errors };
                      delete newErrors.description;
                      setErrors(newErrors);
                    }
                  }}
                />
                {errors.description && (
                  <label className="label">
                    <span className="label-text-alt text-error flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.description}
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Questions - Keep existing question builder UI */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-base-content mb-2">Survey Questions</h2>
              <p className="text-base-content/60">Add and customize your questions (drag to reorder)</p>
            </div>

            <div className="space-y-6">
              {questions.map((question, qIndex) => (
                <div key={question.id}>
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
                    
                    <div className={`bg-base-200 rounded-2xl p-6 space-y-4 hover:shadow-lg transition-all duration-300 border-2 ${
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
                            className={`input input-bordered w-full focus:outline-none focus:ring-2 transition-all ${
                              errors[`question_${qIndex}_title`] ? 'border-error focus:ring-error' : 'focus:ring-purple-500'
                            }`}
                            placeholder="Type your question here..."
                            value={question.title}
                            onChange={(e) => updateQuestion(qIndex, "title", e.target.value)}
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
                            className="select select-bordered w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            value={question.questionType}
                            onChange={(e) => updateQuestion(qIndex, "questionType", e.target.value)}
                          >
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="text">Text Answer</option>
                            <option value="rating">Rating Scale</option>
                          </select>
                        </div>

                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            className="btn btn-sm btn-ghost text-error hover:bg-error/10"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Options for Multiple Choice */}
                      {question.questionType === "multiple-choice" && (
                        <div className="space-y-3 pl-4 border-l-2 border-purple-300">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-base-content/70">Answer Options</label>
                            <button
                              type="button"
                              onClick={() => addOption(qIndex)}
                              className="btn btn-xs btn-ghost text-purple-600 hover:bg-purple-100"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                              Add Option
                            </button>
                          </div>
                          
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <span className="text-base-content/50 font-medium min-w-[2rem]">{String.fromCharCode(65 + optIndex)}.</span>
                              <input
                                type="text"
                                className="input input-sm input-bordered flex-1 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                placeholder={`Option ${optIndex + 1}`}
                                value={option.text}
                                onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                              />
                              {question.options.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeOption(qIndex, optIndex)}
                                  className="btn btn-xs btn-ghost text-error hover:bg-error/10"
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
                    
                    {/* Drop indicator - shows below */}
                    {dragOverIndex === qIndex && draggedIndex !== null && draggedIndex < qIndex && (
                      <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg z-10 animate-pulse"></div>
                    )}
                  </div>

                  {/* Add Question Button - appears after last question */}
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
        )}

        {/* Step 3: Result Experience */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-base-content mb-2">Result Experience</h2>
              <p className="text-base-content/60">Design what respondents see after completing the survey</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Component Library - Left Side */}
              <div className="lg:col-span-2">
                <h3 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                  <span>🎨</span>
                  Component Library
                </h3>
                <div className="space-y-3">
                  {availableComponents.map((comp) => {
                    const existingCount = resultComponents.filter(c => c.type === comp.type).length;
                    const canAdd = !comp.limit || existingCount < comp.limit;
                    
                    return (
                      <div
                        key={comp.type}
                        className={`bg-base-100 rounded-xl p-4 border-2 transition-all ${
                          canAdd 
                            ? 'border-dashed border-base-300 hover:border-primary cursor-pointer hover:shadow-lg' 
                            : 'border-base-200 opacity-50 cursor-not-allowed'
                        }`}
                        onClick={() => canAdd && addComponent(comp.type)}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">{comp.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm">{comp.title}</h4>
                              {comp.badge && (
                                <span className={`badge badge-xs ${
                                  comp.badge === 'Popular' ? 'badge-success' : 'badge-warning'
                                }`}>
                                  {comp.badge}
                                </span>
                              )}
                              {comp.limit && (
                                <span className="badge badge-xs badge-ghost">
                                  {existingCount}/{comp.limit}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-base-content/60">{comp.description}</p>
                          </div>
                          <button className="btn btn-xs btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Visual Preview - Right Side */}
              <div className="lg:col-span-3">
                <h3 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                  <span>👁️</span>
                  Live Preview
                </h3>
                
                {/* Preview Container - Dark Theme */}
                <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-xl p-8 border-2 border-purple-500/30 min-h-[600px] shadow-2xl">
                  {resultComponents.length === 0 ? (
                    <div className="flex items-center justify-center h-full min-h-[500px]">
                      <div className="text-center">
                        <div className="text-6xl mb-4 opacity-20">✨</div>
                        <p className="text-white/60 text-lg font-medium">
                          No components added yet
                        </p>
                        <p className="text-white/40 text-sm mt-2">
                          👈 Start by adding components from the library
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Result Header */}
                      <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                          Your Results
                        </h2>
                        <p className="text-white/50 text-sm">Preview of your result experience</p>
                      </div>

                      {/* Render Components */}
                      {resultComponents.map((comp) => (
                        <div key={comp.id} className="relative group">
                          {/* Component Preview */}
                          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/40 transition-all">
                            {/* Remove Button */}
                            <button
                              onClick={() => removeComponent(comp.id)}
                              className="absolute top-3 right-3 btn btn-xs btn-circle bg-red-500/80 hover:bg-red-500 border-0 text-white opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg"
                            >
                              ✕
                            </button>

                            {/* AI Avatar Component */}
                            {comp.type === 'ai-avatar' && (
                              <div className="p-8">
                                <div className="flex flex-col items-center gap-6">
                                  {/* Avatar Image */}
                                  <div className="relative">
                                    <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-4 border-purple-500/30 overflow-hidden shadow-2xl">
                                      <Image 
                                        src="https://replicate.delivery/yhqm/c6vdjQOQ8HbfJWWxcPjW6tPDZhx06O6fvgZpJKUz5rKIRLWnA/out-0.webp"
                                        alt="AI Generated Avatar"
                                        width={192}
                                        height={192}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 shadow-lg">
                                      <span className="text-2xl">✨</span>
                                    </div>
                                  </div>
                                  
                                  {/* Personality Info */}
                                  <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                      The Creative Visionary
                                    </h3>
                                    <p className="text-white/60 text-sm">Your unique AI-generated personality</p>
                                  </div>
                                  
                                  {/* Personality Description */}
                                  <div className="w-full bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
                                    <p className="text-white/80 text-sm leading-relaxed">
                                      A dynamic AI-generated personality description will appear here based on the user&apos;s survey responses. This section adapts to show unique insights about their character.
                                    </p>
                                  </div>
                                  
                                  {/* Personality Traits */}
                                  <div className="flex flex-wrap gap-2 justify-center">
                                    <span className="badge badge-lg bg-purple-500/20 text-purple-300 border-purple-500/30">Creative</span>
                                    <span className="badge badge-lg bg-pink-500/20 text-pink-300 border-pink-500/30">Analytical</span>
                                    <span className="badge badge-lg bg-blue-500/20 text-blue-300 border-blue-500/30">Leadership</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* AI Custom Section Component */}
                            {comp.type === 'ai-custom' && (
                              <div className="p-8">
                                <div className="space-y-6">
                                  {/* Edit Title */}
                                  <div className="text-center">
                                    <input
                                      type="text"
                                      className="input w-full bg-transparent border-0 border-b-2 border-purple-500/30 focus:border-purple-500 text-white text-2xl font-bold text-center placeholder:text-white/30 focus:outline-none"
                                      value={comp.config.title}
                                      onChange={(e) => updateComponentConfig(comp.id, 'title', e.target.value)}
                                      placeholder="Section Title"
                                    />
                                  </div>
                                  
                                  {/* Edit Prompt */}
                                  <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/20">
                                    <label className="text-white/60 text-xs mb-2 block">AI Prompt (what to generate)</label>
                                    <textarea
                                      className="textarea bg-transparent border-0 w-full text-white/80 text-sm focus:outline-none placeholder:text-white/30 resize-none"
                                      rows={2}
                                      value={comp.config.prompt}
                                      onChange={(e) => updateComponentConfig(comp.id, 'prompt', e.target.value)}
                                      placeholder="e.g., Based on the user's answers, generate their top strengths and areas for improvement..."
                                    />
                                  </div>

                                  {/* Preview Boxes */}
                                  <div className="space-y-4 mt-6">
                                    {comp.config.sections.map((section, idx) => (
                                      <div key={idx} className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-5 backdrop-blur-sm hover:border-purple-500/50 transition-all">
                                        <div className="flex items-start gap-3">
                                          <div className="bg-purple-500/20 rounded-lg p-2 mt-1">
                                            <span className="text-lg">💡</span>
                                          </div>
                                          <div className="flex-1">
                                            <h4 className="font-bold text-purple-300 mb-2 text-lg">{section}</h4>
                                            <p className="text-white/60 text-sm leading-relaxed">
                                              AI-generated {section.toLowerCase()} content will appear here based on your prompt and user responses...
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Custom Message Component */}
                            {comp.type === 'custom-message' && (
                              <div className="p-8 text-center">
                                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                                  <span className="text-4xl">💬</span>
                                </div>
                                <textarea
                                  className="textarea bg-transparent border-2 border-purple-500/30 focus:border-purple-500 w-full text-center text-lg text-white placeholder:text-white/30 focus:outline-none resize-none"
                                  rows={3}
                                  value={comp.config.message}
                                  onChange={(e) => updateComponentConfig(comp.id, 'message', e.target.value)}
                                  placeholder="Thank you for completing our survey! Your feedback means a lot to us."
                                />
                              </div>
                            )}

                            {/* Discount Code Component */}
                            {comp.type === 'discount-code' && (
                              <div className="p-8 bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-t-4 border-green-500/50">
                                <div className="text-center space-y-4">
                                  <div className="bg-green-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto border border-green-500/30">
                                    <span className="text-4xl">🎁</span>
                                  </div>
                                  <h4 className="font-bold text-2xl text-green-400">Special Reward!</h4>
                                  <div className="bg-gray-900/50 rounded-xl p-6 border border-green-500/30 backdrop-blur-sm max-w-md mx-auto">
                                    <input
                                      type="text"
                                      className="input bg-green-500/10 border-2 border-green-500/30 w-full text-center font-mono text-2xl font-bold mb-3 text-green-400 placeholder:text-green-400/30 focus:outline-none focus:border-green-500"
                                      value={comp.config.code}
                                      onChange={(e) => updateComponentConfig(comp.id, 'code', e.target.value)}
                                      placeholder="DISCOUNT20"
                                    />
                                    <input
                                      type="text"
                                      className="input bg-transparent border-0 w-full text-center text-white/80 placeholder:text-white/30 focus:outline-none"
                                      value={comp.config.message}
                                      onChange={(e) => updateComponentConfig(comp.id, 'message', e.target.value)}
                                      placeholder="Get 20% off your next purchase!"
                                    />
                                  </div>
                                  <p className="text-xs text-green-400/60">✨ Expires in {comp.config.expiryDays} days</p>
                                </div>
                              </div>
                            )}

                            {/* CTA Button Component */}
                            {comp.type === 'cta-button' && (
                              <div className="p-8 text-center">
                                <div className="space-y-4 max-w-md mx-auto">
                                  <div className="bg-gray-900/50 rounded-xl p-4 border border-purple-500/20">
                                    <label className="text-white/60 text-xs mb-2 block text-left">Button Text</label>
                                    <input
                                      type="text"
                                      className="input bg-transparent border-0 border-b border-purple-500/30 w-full text-center text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500"
                                      value={comp.config.buttonText}
                                      onChange={(e) => updateComponentConfig(comp.id, 'buttonText', e.target.value)}
                                      placeholder="Visit Our Website"
                                    />
                                  </div>
                                  <div className="bg-gray-900/50 rounded-xl p-4 border border-purple-500/20">
                                    <label className="text-white/60 text-xs mb-2 block text-left">Button URL</label>
                                    <input
                                      type="url"
                                      className="input bg-transparent border-0 w-full text-center text-sm text-white/60 placeholder:text-white/30 focus:outline-none"
                                      value={comp.config.buttonUrl}
                                      onChange={(e) => updateComponentConfig(comp.id, 'buttonUrl', e.target.value)}
                                      placeholder="https://your-website.com"
                                    />
                                  </div>
                                  <div className="pt-4">
                                    <button className="btn bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white btn-lg w-full shadow-lg hover:shadow-purple-500/50 transition-all">
                                      {comp.config.buttonText || 'Your CTA Button'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Social Share Component */}
                            {comp.type === 'social-share' && (
                              <div className="p-8 bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-t-4 border-blue-500/50">
                                <div className="text-center space-y-6">
                                  <h4 className="font-bold text-2xl text-blue-400">Share Your Results!</h4>
                                  <div className="bg-gray-900/50 rounded-xl p-4 border border-blue-500/20 max-w-md mx-auto">
                                    <input
                                      type="text"
                                      className="input bg-transparent border-0 w-full text-center text-white placeholder:text-white/30 focus:outline-none"
                                      value={comp.config.message}
                                      onChange={(e) => updateComponentConfig(comp.id, 'message', e.target.value)}
                                      placeholder="Check out my personality results!"
                                    />
                                  </div>
                                  <div className="flex justify-center gap-4">
                                    <button className="btn btn-circle btn-lg bg-blue-500/20 hover:bg-blue-500 border-2 border-blue-500/30 hover:border-blue-500 text-blue-400 hover:text-white transition-all shadow-lg hover:shadow-blue-500/50">
                                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                      </svg>
                                    </button>
                                    <button className="btn btn-circle btn-lg bg-blue-600/20 hover:bg-blue-600 border-2 border-blue-600/30 hover:border-blue-600 text-blue-400 hover:text-white transition-all shadow-lg hover:shadow-blue-600/50">
                                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                                      </svg>
                                    </button>
                                    <button className="btn btn-circle btn-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500 hover:to-pink-500 border-2 border-purple-500/30 hover:border-transparent text-purple-400 hover:text-white transition-all shadow-lg hover:shadow-purple-500/50">
                                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="btn btn-outline"
        >
          ← Previous
        </button>

        <div className="flex gap-2">
          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="btn btn-primary"
            >
              Next Step →
            </button>
          ) : (
            <ButtonCreateSurvey
              surveyData={{
                name,
                description,
                status: "active",
                questions: questions.map((q, index) => ({
                  title: q.title,
                  questionType: q.questionType,
                  options: q.questionType === "multiple-choice" ? q.options : [],
                  required: q.required || false,
                  order: index
                })),
                resultExperience: {
                  enabled: resultComponents.length > 0,
                  components: resultComponents
                }
              }}
              setErrors={setErrors}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FormNewSurveySteps;
