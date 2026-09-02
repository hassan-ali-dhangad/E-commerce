import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
    quantity: {
    type: Number,
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],

  description: {
    type: String,
    required: true,
  },
  features: [
    {
      type: String,
    },
  ],
  inStock: {
    type: Boolean,
    default: true,
  },
  colors: [
    {
      type: String,
    },
  ],
  sizes: [
    {
      type: String,
    },
  ],
  isFeatured: {
  type: Boolean,
  default: false,
}
},{timestamps: true});

const Product = mongoose.model("Product", productSchema);

export default Product;