"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

//Helps to refresh view data when new data is added
import { useRouter } from "next/navigation";

const FormNewSurvey = () => {
  const router = useRouter();

  //To store the name of the survey
  const [name, setName] = useState("");
  //Store the description of the survey
  const [description, setDescription] = useState("");
  //To store the AI instructions
  const [aiInstructions, setAiInstructions] = useState("");
  // To store the status of the survey
  const [status, setStatus] = useState("active");
  //To store loading state
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    //Prevent the default behaviour of reloading the page on submit
    event.preventDefault();

    //Prevent user from making 2 API calls when they accidentally press submit twice
    if (isLoading) return;

    setIsLoading(true);

    try {
      //1. Call to API to create a new survey
      await axios.post("/survey", {
        name,
        description,
        aiInstructions,
        status,
      });

      //2. Reset the state of the form
      setName("");
      setDescription("");
      setAiInstructions("");
      setStatus("");
      toast.success("Survey created successfully!");

      //3. Refresh the page to show the new survey in the list
      router.refresh();

      //Redirect back to dashboard
      router.push("/dashboard");
    } catch (e) {
      const errorMessage =
        e.response?.data?.error || e.message || "Something went wrong";
      toast.error(errorMessage);
      console.log(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="bg-base-100 p-8 rounded-3xl space-y-8"
      onSubmit={handleSubmit}
    >
      {/* 1. Title */}
      <p className="font-bold text-lg">Create a new survey</p>
      {/* 2. Form */}
      <fieldset className="fieldset">
        <legend className="fieldset-legend pb-2">Survey name</legend>
        <input
          required
          type="text"
          className="input input-bordered w-full"
          placeholder="Type name here"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend pb-2">Description</legend>
        <input
          required
          type="text"
          className="input input-bordered w-full"
          placeholder="Type description here"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend pb-2">AI Instructions</legend>
        <input
          required
          type="text"
          className="input input-bordered w-full"
          placeholder="Type AI instructions here"
          value={aiInstructions}
          onChange={(event) => setAiInstructions(event.target.value)}
        />
      </fieldset>
      {/* 3. Button */}
      <button className="btn btn-primary btn-block" type="submit">
        {isLoading && (
          <span className="loading loading-spinner loading-xs"></span>
        )}
        Create Survey
      </button>
    </form>
  );
};

export default FormNewSurvey;
