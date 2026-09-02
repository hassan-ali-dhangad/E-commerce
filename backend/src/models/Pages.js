import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: [true, "Page name is required"],
      trim: true,
    },

    icon: {
      type: String,
      required: [true, "Icon is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    path: {
      type: String,
      required: [true, "Path is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    is_visible: {
      type: String,
      enum: ["yes", "no"],
      default: "yes",
    },
  },
  {
    timestamps: true,
  },
);

pageSchema.index({ name: 1 }, { unique: true });

const Page = mongoose.model("Page", pageSchema);

export default Page;