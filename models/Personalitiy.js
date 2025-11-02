import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const personalitySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    trait1: {
      type: String,
      required: true,
    },
    trait2: {
      type: String,
      required: true,
    },
    trait3: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
)

// add plugin that converts mongoose to json
personalitySchema.plugin(toJSON);

export default mongoose.models.Personality || mongoose.model("Personality", personalitySchema);
