const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const {
  createProduct,
  allProducts,
  singleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.post(
  "/product/create",
  upload.array("images"),
  createProduct,
  isAuthenticatedUser
);

router.route("/products").get(allProducts);
router
  .route("/product/:id")
  .get(singleProduct)
  .put(upload.array("images"), updateProduct)
  .delete(deleteProduct);

module.exports = router;
