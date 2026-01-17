import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    verificationToken: {
      type: String,
      required: true,
    },
    tokenExpiry: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-delete expired pending users after 24 hours
pendingUserSchema.index({ tokenExpiry: 1 }, { expireAfterSeconds: 0 });

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);
export default PendingUser;
