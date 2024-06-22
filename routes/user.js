const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const {
  register,
  login,
  profile,
  logout,
  updateProfile,
} = require("../controllers/userController");

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", isAuthenticatedUser, profile);
router.put(
  "/profile/update",
  isAuthenticatedUser,
  upload.single("avatar"),
  updateProfile
);
module.exports = router;
