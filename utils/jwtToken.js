const sendToken = (user, statusCode, res) => {
  // Create Jwt token
  const token = user.getJwtToken();

  // Options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  console.log(token, "token");

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
      ),
      httpOnly: true, // Cookie can't be accessed via client-side JavaScript
      secure: process.env.NODE_ENV === "production", // Cookie sent only over HTTPS in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // For cross-site cookie policy
    })
    .json({
      success: true,
      token,
      user,
    });
};

module.exports = sendToken;
