import mongoose from "mongoose";

const questionSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  questionType: {
    type: String,
    required: true,
    enum: [
      "multiple-choice",
      "checkboxes",
      "text-short",
      "text-long",
      "dropdown",
    ],
  },
  // Options for multiple choice, checkboxes, dropdown
  options: [
    {
      text: String,
      value: String,
    },
  ],
  // Question settings
  required: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
  },
});
