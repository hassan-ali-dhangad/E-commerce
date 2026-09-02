import Product from "../models/Product.js";
import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Product.countDocuments({
          category: category._id,
        });

        return {
          id: category._id,
          name: category.name,
          description: category.description,
          count,
          image: category.image,
        };
      }),
    );

    res.status(200).json({
      success: true,
      categories: categoriesWithCount,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const count = await Product.countDocuments({
      category: category._id,
    });

    res.status(200).json({
      success: true,

      category: {
        id: category._id,
        name: category.name,
        description: category.description,
        count,
        image: category.image,
      },
    });
  } catch (error) {
    console.error("Get category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    let imageUrl = "";
    let imagePublicId = "";

    // Upload image
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "shopsphere/categories",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        stream.end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const category = await Category.create({
      name: name.trim(),
      description: description?.trim() || "",
      image: imageUrl,
      imagePublicId,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ========================================
    // NAME
    // ========================================

    if (name !== undefined) {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
        });
      }

      const existingCategory = await Category.findOne({
        name: trimmedName,
        _id: { $ne: category._id },
      });

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: "Category already exists",
        });
      }

      category.name = trimmedName;
    }

    // ========================================
    // DESCRIPTION
    // ========================================

    if (description !== undefined) {
      category.description = description.trim();
    }

    // ========================================
    // REMOVE EXISTING IMAGE
    // ========================================

    const removeImage =
      req.body.removeImage === "true";

    // ========================================
    // NEW IMAGE
    // ========================================

    if (req.file) {
      // Upload new image first
      const uploadResult = await new Promise(
        (resolve, reject) => {
          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder: "shopsphere/categories",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              },
            );

          stream.end(req.file.buffer);
        },
      );

      // Delete old Cloudinary image
      if (category.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(
            category.imagePublicId,
          );
        } catch (cloudinaryError) {
          console.error(
            "Failed to delete old Cloudinary image:",
            cloudinaryError,
          );
        }
      }

      category.image = uploadResult.secure_url;
      category.imagePublicId =
        uploadResult.public_id;
    }

    // ========================================
    // REMOVE IMAGE WITHOUT REPLACING
    // ========================================

    else if (removeImage) {
      if (category.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(
            category.imagePublicId,
          );
        } catch (cloudinaryError) {
          console.error(
            "Failed to delete Cloudinary image:",
            cloudinaryError,
          );
        }
      }

      category.image = "";
      category.imagePublicId = "";
    }

    // ========================================
    // SAVE
    // ========================================

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Don't allow deleting a category that has products
    const productCount = await Product.countDocuments({
      category: category._id,
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category because products are assigned to it",
      });
    }

    // Delete image from Cloudinary
    if (category.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(category.imagePublicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary image deletion failed:", cloudinaryError);
      }
    }

    // Delete category from MongoDB
    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};
