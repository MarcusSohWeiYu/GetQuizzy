"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ButtonCreateSurvey from "./ButtonCreateSurvey";
import AIAvatarComponent from "./resultComponents/AIAvatarComponent";
import AICustomComponent from "./resultComponents/AICustomComponent";
import CustomMessageComponent from "./resultComponents/CustomMessageComponent";
import DiscountCodeComponent from "./resultComponents/DiscountCodeComponent";
import CTAButtonComponent from "./resultComponents/CTAButtonComponent";
import ComponentLibrary, { availableComponents } from "./resultComponents/ComponentLibrary";

const FormNewSurveySteps = () => {
  const router = useRouter();
  
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
        return { 
          showPersonality: true, 
          style: 'animated',
          aiInstructions: 'Create a unique character based on their survey responses. The avatar should reflect their personality traits, communication style, and behavioral patterns. Generate a creative and engaging personality description that makes the user feel understood and special.'
        };
      case 'ai-custom':
        return { 
          title: 'Your Personalized Insights',
          prompt: 'Analyze the user\'s survey responses and generate personalized insights, recommendations, or analysis based on their answers. Be creative and specific.',
          sections: ['Section 1']
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
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/dashboard')}
          className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-base-content"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>

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
              <ComponentLibrary 
                resultComponents={resultComponents}
                onAddComponent={addComponent}
              />

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
                      {resultComponents.map((comp) => {
                        const componentProps = {
                          comp,
                          updateComponentConfig,
                          removeComponent
                        };

                        switch(comp.type) {
                          case 'ai-avatar':
                            return <AIAvatarComponent key={comp.id} {...componentProps} />;
                          case 'ai-custom':
                            return <AICustomComponent key={comp.id} {...componentProps} />;
                          case 'custom-message':
                            return <CustomMessageComponent key={comp.id} {...componentProps} />;
                          case 'discount-code':
                            return <DiscountCodeComponent key={comp.id} {...componentProps} />;
                          case 'cta-button':
                            return <CTAButtonComponent key={comp.id} {...componentProps} />;
                          default:
                            return null;
                        }
                      })}
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
