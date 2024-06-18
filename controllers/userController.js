const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const crypto = require("crypto");
const sendToken = require("../utils/jwtToken");
const cloudinary = require("cloudinary").v2;

exports.register = async (req, res, next) => {
  const { firstname, lastname, address, phone, email, password, confirmPassword } = req.body;

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
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  console.log(user);

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 200, res);
};

// exports.logout = async (req, res, next) => {
//   console.log("controller logout");
//   sendToken(null, 200, res, true); // Destroy token
// };

exports.logout = async (req, res, next) => {
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
