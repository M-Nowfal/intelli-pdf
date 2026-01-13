import { model, models, Schema } from "mongoose";

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  avatar: {
    type: String
  },
  stats: {
    totalDocuments: {
      type: Number,
      default: 0
    },
    flashcardsMastered: {
      type: Number,
      default: 0
    },
    studyStreak: {
      streak: {
        type: Number,
        default: 0
      },
      lastActive: {
        type: Date,
        default: Date.now
      }
    },
    aiCredits: {
      type: Number,
      default: 1000
    }
  },
  password: {
    type: String
  },
  provider: {
    type: String,
    enum: ["credentials", "google"],
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const User = models.User || model<IUser>("User", UserSchema);
