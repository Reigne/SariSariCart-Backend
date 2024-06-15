const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const {
  createCategory,
  allCategories,
  singleCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.post("/category/create/", upload.single("image"), createCategory);

router.route("/categories").get(allCategories);
router
  .route("/category/:id")
  .get(singleCategory)
  .put(upload.single("image"), updateCategory)
  .delete(deleteCategory);

module.exports = router;
