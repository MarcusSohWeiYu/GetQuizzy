"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ButtonCreateSurvey = ({ surveyData, setErrors }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const validateSurvey = () => {
        const newErrors = {};

        // Validate survey name
        if (!surveyData.name || !surveyData.name.trim()) {
            newErrors.name = 'Survey name is required';
        } else if (surveyData.name.trim().length < 3) {
            newErrors.name = 'Survey name must be at least 3 characters long';
        } else if (surveyData.name.trim().length > 100) {
            newErrors.name = 'Survey name must be less than 100 characters';
        }

        // Validate description
        if (!surveyData.description || !surveyData.description.trim()) {
            newErrors.description = 'Survey description is required';
        } else if (surveyData.description.trim().length < 10) {
            newErrors.description = 'Survey description must be at least 10 characters long';
        } else if (surveyData.description.trim().length > 500) {
            newErrors.description = 'Survey description must be less than 500 characters';
        }

        // Validate AI instructions
        if (!surveyData.aiInstructions || !surveyData.aiInstructions.trim()) {
            newErrors.aiInstructions = 'AI avatar instructions are required';
        } else if (surveyData.aiInstructions.trim().length < 10) {
            newErrors.aiInstructions = 'AI instructions must be at least 10 characters long';
        }

        // Validate questions
        if (!surveyData.questions || surveyData.questions.length === 0) {
            toast.error('At least one question is required');
            return false;
        }

        // Validate each question
        for (let i = 0; i < surveyData.questions.length; i++) {
            const question = surveyData.questions[i];
            const questionNum = i + 1;
            const questionIndex = i; // Use array index for error keys

            // Check question title
            if (!question.title || !question.title.trim()) {
                newErrors[`question_${questionIndex}_title`] = `Question ${questionNum}: Title is required`;
            } else if (question.title.trim().length < 5) {
                newErrors[`question_${questionIndex}_title`] = `Title must be at least 5 characters long`;
            } else if (question.title.trim().length > 200) {
                newErrors[`question_${questionIndex}_title`] = `Title must be less than 200 characters`;
            }

            // Validate multiple-choice questions
            if (question.questionType === 'multiple-choice') {
                if (!question.options || question.options.length === 0) {
                    newErrors[`question_${questionIndex}_options`] = `At least one option is required`;
                } else if (question.options.length < 2) {
                    newErrors[`question_${questionIndex}_options`] = `At least 2 options required`;
                } else {
                    // Check each option
                    const filledOptions = question.options.filter(opt => opt.text && opt.text.trim());
                    
                    if (filledOptions.length < 2) {
                        newErrors[`question_${questionIndex}_options`] = `At least 2 options must be filled in`;
                    } else {
                        // Check for duplicate options
                        const optionTexts = filledOptions.map(opt => opt.text.trim().toLowerCase());
                        const uniqueOptions = new Set(optionTexts);
                        
                        if (uniqueOptions.size !== optionTexts.length) {
                            newErrors[`question_${questionIndex}_options`] = `Duplicate options are not allowed`;
                        }

                        // Check option length
                        for (let j = 0; j < filledOptions.length; j++) {
                            if (filledOptions[j].text.trim().length > 100) {
                                newErrors[`question_${questionIndex}_options`] = `Option ${j + 1} must be less than 100 characters`;
                                break;
                            }
                        }
                    }
                }
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            // Scroll to first error
            const firstErrorKey = Object.keys(newErrors)[0];
            const firstErrorElement = document.querySelector(`[class*="${firstErrorKey}"]`);
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }

        return true;
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        
        if (isLoading) return;

        // Run validation
        if (!validateSurvey()) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            const response = await axios.post('/survey', surveyData);
            const newSurveyId = response.data.surveyId;
            toast.success("Survey created successfully", {
                icon: '✅',
                duration: 3000,
            });
            router.push(`/dashboard`);
            router.refresh();
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || "Failed to create survey";
            toast.error(errorMessage);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-6">
            <button 
              className="btn btn-lg w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 font-bold text-lg" 
              type="submit"
              onClick={handleCreate}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                  Creating Survey...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  Create Survey
                </>
              )}
            </button>
          </div>
    );
};

export default ButtonCreateSurvey;