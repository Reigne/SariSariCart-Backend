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
  getAllUsers,
  updateUserByAdmin,
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

// getAllUsers
router.get(
  "/admin/users",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllUsers
);

router.put("/admin/user/update/:id", isAuthenticatedUser, updateUserByAdmin);

module.exports = router;
