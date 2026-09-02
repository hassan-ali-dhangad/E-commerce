import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js"; // adjust path as needed
import streamifier from "streamifier";
import Page from "../models/Pages.js";

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      },
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      quantity,
      category,
      tags,
      description,
      features,
      inStock,
      colors,
      sizes,
      isFeatured,
    } = req.body;

    if (
      !name ||
      price === undefined ||
      quantity === undefined ||
      !category ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, price, quantity, category, and description are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Process file uploads
    let imageUrl = "";
    let imageUrls = [];

    if (req.files?.image?.length) {
      imageUrl = await uploadToCloudinary(req.files.image[0].buffer);
    }

    if (req.files?.images?.length) {
      const uploadPromises = req.files.images.map((file) =>
        uploadToCloudinary(file.buffer),
      );
      imageUrls = await Promise.all(uploadPromises);
      if (!imageUrl && imageUrls.length > 0) {
        imageUrl = imageUrls[0];
      }
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    // Format array values sent via FormData
    const normalizeArray = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      return [val];
    };

    const product = await Product.create({
      name,
      price: Number(price),
      quantity: Number(quantity),
      image: imageUrl,
      images: imageUrls.length > 0 ? imageUrls : [imageUrl],
      category,
      tags: normalizeArray(tags),
      description,
      features: normalizeArray(features),
      inStock: inStock === "true" || inStock === true,
      colors: normalizeArray(colors),
      sizes: normalizeArray(sizes),
      isFeatured: isFeatured === "true" || isFeatured === true,
    });

    const populatedProduct = await product.populate(
      "category",
      "name slug icon image",
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: populatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};
// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      featured,
      page = 1,
      limit = 12,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const filter = {};

    // Search
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          tags: {
            $in: [new RegExp(search, "i")],
          },
        },
      ];
    }

    // Category
    if (category) {
      const categoryDoc = await Category.findOne({
        slug: category.toLowerCase(),
      });

      if (!categoryDoc) {
        return res.status(200).json({
          success: true,
          products: [],
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: 0,
            pages: 0,
          },
        });
      }

      filter.category = categoryDoc._id;
    }

    // Featured
    // For now, first products can be treated as featured.
    // Later you can add a dedicated `isFeatured` field.
    if (featured === "true") {
      filter.isFeatured = true;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const sortOrder = order === "asc" ? 1 : -1;

    const products = await Product.find(filter)
      .populate("category", "name slug icon image")
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id).populate(
      "category",
      "name slug icon image",
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (req.body.category) {
      if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    let existingImages = req.body.existingImages;
    if (existingImages && !Array.isArray(existingImages)) {
      existingImages = [existingImages];
    }
    let updatedImages = existingImages || [];

    if (req.files?.images?.length) {
      const uploadPromises = req.files.images.map((file) =>
        uploadToCloudinary(file.buffer),
      );
      const newUploadedUrls = await Promise.all(uploadPromises);
      updatedImages = [...updatedImages, ...newUploadedUrls];
    }

    const updateData = { ...req.body };
    if (updatedImages.length > 0) {
      updateData.images = updatedImages;
      updateData.image = updatedImages[0];
    }

    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.quantity) updateData.quantity = Number(updateData.quantity);
    if (updateData.inStock !== undefined) {
      updateData.inStock =
        updateData.inStock === "true" || updateData.inStock === true;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    ).populate("category", "name slug icon image");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};
// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// =====================================================
// GET ACTIVE PAGES
// =====================================================

export const getPages = async (req, res) => {
  try {
    const pages = await Page.find({
      status: "active",
      is_visible: "yes",
    })
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json({
      success: true,
      pages,
    });
  } catch (error) {
    console.error("Get pages error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load pages",
    });
  }
};