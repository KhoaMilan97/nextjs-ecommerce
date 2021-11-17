import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    inStock: {
      type: Number,
      default: 0,
    },
    checked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

let Dataset =
  mongoose.models.product || mongoose.model("product", productSchema);

export default Dataset;
