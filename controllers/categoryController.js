const CategoryModel = require("../models/category");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/errorHandler");

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const existingCategory = await CategoryModel.findOne({
      name: req.body.name,
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Category name already exists!" });
    }

    console.log(req.body.image);
    
    let uploadImage = {};

    if (req.body.image) {
      console.log("hello meron");
      const cloudinaryFolderOption = {
        folder: "category",
      };

      const result = await cloudinary.v2.uploader.upload(
        req.body.image,
        cloudinaryFolderOption
      );

      uploadImage = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } else {
      console.log("hello wala");
      uploadImage = {
        public_id: null,
        url: null,
      }; // Ensure image is an object
    }

    const category = await CategoryModel.create({
      name,
      image: uploadImage,
    });

    console.log(category);

    res.status(201).json({ success: true, category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create category" });
  }
};

const allCategories = async (req, res, next) => {
  try {
    const categories = await CategoryModel.find().sort({ createdAt: -1 }); // Sort by createdAt field in descending order;

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching brand data",
    });
  }
};

const singleCategory = async (req, res, next) => {
  try {
    const category = await CategoryModel.findById(req.params.id);

    if (!category) {
      return next(
        new ErrorHandler(`Category not found with id: ${req.params.id}`)
      );
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    // Handle errors here
    console.error(error);
    return next(new ErrorHandler("Error while fetching category details"));
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const findCategory = await CategoryModel.findById(req.params.id);

    if (!findCategory) {
      return next(
        new ErrorHandler(`Category not found with id: ${req.params.id}`)
      );
    }

    let image = [];

    if (req.body.image) {
      const cloudinaryFolderOption = {
        folder: "category",
      };

      const result = await cloudinary.v2.uploader.upload(
        req.body.image,
        cloudinaryFolderOption
      );

      image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } else {
      image = findCategory.images;
    }

    const category = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        image: image,
      },
      { new: true }
    );

    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    // Handle errors using the ErrorHandler
    return next(
      new ErrorHandler("An error occurred while updating the category", 500)
    );
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await CategoryModel.findById(req.params.id);

    if (!category) {
      return next(
        new ErrorHandler(`Category does not exist with id: ${req.params.id}`)
      );
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    return next(new ErrorHandler("Error deleting the category", 500));
  }
};

module.exports = {
  createCategory,
  allCategories,
  singleCategory,
  updateCategory,
  deleteCategory,
};
