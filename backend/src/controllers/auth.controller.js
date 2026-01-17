import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import PendingUser from "../models/pendingUser.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "../lib/transporter.js";
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters" });
    }

    // Check if email already exists in verified users
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if email already has a pending verification
    const existingPendingUser = await PendingUser.findOne({ email });
    if (existingPendingUser) {
      // Delete old pending user and create new one
      await PendingUser.deleteOne({ email });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create pending user
    const pendingUser = new PendingUser({
      fullName,
      email,
      password: hashedPassword,
      verificationToken,
      tokenExpiry,
    });

    await pendingUser.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, fullName, verificationToken);
      res.status(200).json({
        message:
          "Verification email sent. Please check your inbox to verify your account.",
        email: email,
      });
    } catch (emailError) {
      // If email fails, delete the pending user
      await PendingUser.deleteOne({ email });
      console.log("Error sending verification email:", emailError);
      res
        .status(500)
        .json({
          message: "Failed to send verification email. Please try again.",
        });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "internal server Error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("erro in loin controller", error.message);
    res.status(500).json({ message: "internal Server Error" });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ message: "profile pic is requires" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "internal server error" });
  }
};
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "internal Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    if (!token) {
      return res
        .status(400)
        .json({ message: "Verification token is required" });
    }

    // Find pending user with this token
    const pendingUser = await PendingUser.findOne({
      verificationToken: token,
      tokenExpiry: { $gt: Date.now() }, // Check if token is not expired
    });

    if (!pendingUser) {
      return res.status(400).json({
        message: "Invalid or expired verification token. Please sign up again.",
      });
    }

    // Create verified user
    const newUser = new User({
      fullName: pendingUser.fullName,
      email: pendingUser.email,
      password: pendingUser.password,
      profilePic: "",
    });

    await newUser.save();

    // Delete pending user
    await PendingUser.deleteOne({ _id: pendingUser._id });

    // Generate JWT token
    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      message: "Email verified successfully!",
    });
  } catch (error) {
    console.log("Error in verifyEmail controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user is already verified
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Find pending user
    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      return res.status(404).json({
        message:
          "No pending verification found for this email. Please sign up.",
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update pending user with new token
    pendingUser.verificationToken = verificationToken;
    pendingUser.tokenExpiry = tokenExpiry;
    await pendingUser.save();

    // Send verification email
    await sendVerificationEmail(email, pendingUser.fullName, verificationToken);

    res.status(200).json({
      message: "Verification email resent. Please check your inbox.",
    });
  } catch (error) {
    console.log("Error in resendVerificationEmail controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
