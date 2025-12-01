"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ButtonDeleteSurvey = ({ surveyId, surveyName }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1); // 1: initial, 2: confirmation
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setShowModal(true);
    setDeleteStep(1);
    setConfirmationText("");
  };

  const handleProceedToConfirmation = () => {
    setDeleteStep(2);
  };

  const handleDelete = async () => {
    if (confirmationText !== surveyName) {
      toast.error("Survey name doesn't match");
      return;
    }

    try {
      setIsDeleting(true);
      await axios.delete(`/survey?id=${surveyId}`);
      toast.success("Survey deleted successfully");
      setShowModal(false);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.log(error.message);
      const errorMessage =
        error.response?.data?.error || error.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const closeModal = () => {
    if (!isDeleting) {
      setShowModal(false);
      setDeleteStep(1);
      setConfirmationText("");
    }
  };

  return (
    <>
      <button 
        className="btn btn-error"
        onClick={handleDeleteClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
        Delete Survey
      </button>

      {/* Delete Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                Delete {surveyName}
              </h2>
              <button 
                onClick={closeModal}
                disabled={isDeleting}
                className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {deleteStep === 1 ? (
                <>
                  {/* Warning Banner */}
                  <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      <div className="flex-1">
                        <p className="font-semibold text-yellow-500 mb-1">
                          Unexpected bad things will happen if you don&#39;t read this!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Warning List */}
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0 mt-1.5"></div>
                      <p>
                        This will permanently delete the <span className="font-semibold text-white">{surveyName}</span> survey, all questions, responses, and analytics data.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0 mt-1.5"></div>
                      <p>
                        This action cannot be undone. All data will be lost forever.
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={handleProceedToConfirmation}
                    className="w-full btn bg-red-600 hover:bg-red-700 text-white border-none mt-4"
                  >
                    I have read and understand these effects
                  </button>
                </>
              ) : (
                <>
                  {/* Confirmation Step */}
                  <div className="space-y-4">
                    <p className="text-sm text-gray-300">
                      To confirm, type <span className="font-semibold text-white">&quot;{surveyName}&quot;</span> in the box below
                    </p>
                    
                    <input
                      type="text"
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                      placeholder={surveyName}
                      disabled={isDeleting}
                      className="input input-bordered w-full bg-gray-800 border-gray-700 text-white focus:border-red-500 focus:outline-none"
                      autoFocus
                    />

                    <button
                      onClick={handleDelete}
                      disabled={confirmationText !== surveyName || isDeleting}
                      className="w-full btn bg-red-600 hover:bg-red-700 text-white border-none disabled:bg-gray-700 disabled:text-gray-500"
                    >
                      {isDeleting ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Deleting...
                        </>
                      ) : (
                        'Delete this survey'
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonDeleteSurvey;
