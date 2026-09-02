import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    permissions: [
      {
        page_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Page",
          required: true,
        },

        actions: {
          create: {
            type: Boolean,
            default: false,
          },

          read: {
            type: Boolean,
            default: false,
          },

          update: {
            type: Boolean,
            default: false,
          },

          delete: {
            type: Boolean,
            default: false,
          },
        },
      },
    ],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

roleSchema.index({ name: 1 }, { unique: true });

const Role = mongoose.model("Role", roleSchema);

export default Role;