import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    root: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/khoa-milan/image/upload/v1609837909/avatar/pngtree-character-default-avatar-image_2237203_jpyjx7.jpg",
    },
  },
  { timestamps: true }
);

let Dataset = mongoose.models.user || mongoose.model("user", userSchema);

export default Dataset;
