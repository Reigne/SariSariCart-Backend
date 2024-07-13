const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const crypto = require("crypto");
const sendToken = require("../utils/jwtToken");
const cloudinary = require("cloudinary").v2;

exports.register = async (req, res, next) => {
  const {
    firstname,
    lastname,
    address,
    phone,
    email,
    password,
    confirmPassword,
  } = req.body;

  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password and Confirm Password do not match", 401)
    );
  }

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ErrorHandler("Email already exists", 409));
    }

    // Create a new user if the email doesn't already exist
    const user = await User.create({
      firstname,
      lastname,
      address,
      phone,
      email,
      password,
    });

    // Send response with token
    sendToken(user, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return next(new ErrorHandler("Please enter email & password", 400));
    }

    // Find user by email and include password in the result
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    // Check if the provided password matches the stored password
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    // If everything is correct, send the token
    sendToken(user, 200, res);

    console.log(user, "user log");

  } catch (error) {
    // Pass any caught errors to the error handling middleware
    next(error);
  }
};
// exports.logout = async (req, res, next) => {
//   console.log("controller logout");
//   sendToken(null, 200, res, true); // Destroy token
// };

exports.logout = async (req, res, next) => {
  console.log("removed token")

  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

exports.profile = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  console.log("logged user", user);

  res.status(200).json({
    success: true,
    user,
  });
};

exports.updateProfile = async (req, res, next) => {
  const { firstname, lastname, address, phone, email, avatar } = req.body;

  // Prepare updated user data
  const newUserData = {
    firstname,
    lastname,
    address,
    phone,
    email,
  };

  try {
    if (avatar) {
      // Upload image to Cloudinary
      const cloudinaryFolderOption = {
        folder: "users", // Replace with your desired folder name
      };

      const result = await cloudinary.uploader.upload(avatar, cloudinaryFolderOption);

      newUserData.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    // Update user in the database
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
