const ProductModel = require("../models/product");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/errorHandler");

const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, stock, category, images } =
      req.body;

    console.log(req.body);

    let uploadImages = [];

    if (images && images.length > 0) {
      for (const image of images) {
        const cloudinaryFolderOption = { folder: "product" };

        const result = await cloudinary.v2.uploader.upload(
          image,
          cloudinaryFolderOption
        );

        uploadImages.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    const product = await ProductModel.create({
      name,
      price,
      description,
      stock,
      category,
      images: uploadImages,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

const allProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.find()
      .sort({ createdAt: -1 })
      .populate(["category"]); // Sort by createdAt field in descending order;

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching product data",
    });
  }
};

const singleProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id).populate([
      "category",
    ]);

    if (!product) {
      return next(
        new ErrorHandler(`Product not found with id: ${req.params.id}`)
      );
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    // Handle errors here
    console.error(error);
    return next(new ErrorHandler("Error while fetching product details"));
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const findProduct = await ProductModel.findById(req.params.id);

    if (!findProduct) {
      return next(
        new ErrorHandler(`Product not found with id: ${req.params.id}`)
      );
    }

    const { name, price, description, stock, category, images } =
      req.body;

    let uploadImages = [];

    if (images && images.length > 0) {
      for (const image of images) {
        const cloudinaryFolderOption = { folder: "product" };

        const result = await cloudinary.v2.uploader.upload(
          image,
          cloudinaryFolderOption
        );

        uploadImages.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    } else {
      uploadImages = findProduct.images;
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        description,
        stock,
        category,
        images: uploadImages,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return next(
      new ErrorHandler("An error occurred while updating the product", 500)
    );
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return next(
        new ErrorHandler(`Product does not exist with id: ${req.params.id}`)
      );
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    return next(new ErrorHandler("Error deleting the product", 500));
  }
};

module.exports = {
  createProduct,
  allProducts,
  singleProduct,
  updateProduct,
  deleteProduct,
};
