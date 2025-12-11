import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import path from "path";
import axios from "axios";


import oauth2client from "../utils/googleConfig.js";

export const Register = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber, role } = req.body;

    if (!fullname || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({
        message: "Some fields are empty , so fill and try again ",
        success: false,
      });
    }

    // Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already registered with this Email",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 11);

    // cloudinary use here
    let profilePhotoUrl = "";
    try {
      if (req.file) {
        const fileUri = getDataUri(req.file);
        if (fileUri && fileUri.content) {
          const cloudResponse = await cloudinary.uploader.upload(
            fileUri.content
          );
          profilePhotoUrl = cloudResponse.secure_url;
        }
      }
    } catch (error) {
      return res.status(500).json({
        message: "Error uploading profile photo. Please try again later.",
        success: false,
      });
    }
 

    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      profile: {
        profilePhoto: profilePhotoUrl,
      },
    });

 
    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(201)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        // secure in production
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        message: `${user.fullname} created account Successfully`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error. Please try again later.",
      success: false,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Some fields are missing , So fill it and try again later",
        success: false,
      });
    }
    const existedUser = await User.findOne({ email });
    if (!existedUser) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      existedUser.password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: true,
      });
    }

   
    if (role !== existedUser.role) {
      return res.status(400).json({
        message:
          "Account doesn't exist with this role , so check the role and try again",
        success: false,
      });
    }

  
    const tokenData = {
      userId: existedUser._id,
    };

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    const user = {
      _id: existedUser._id,
      fullname: existedUser.fullname,
      email: existedUser.email,
      phoneNumber: existedUser.phoneNumber,
      role: existedUser.role,
      profile: existedUser.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const Logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "user loggedOut Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const files = req.files || {};
    const resumeFile = files.resume && files.resume[0] ? files.resume[0] : null;
    const photoFile =
      files.profilePhoto && files.profilePhoto[0]
        ? files.profilePhoto[0]
        : null;

    let skillsArray;
    if (skills) {
      skillsArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length);
    }
    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) {
      const digitsOnly = String(phoneNumber).replace(/\D/g, "");
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        return res.status(400).json({
          message: "Invalid phone number",
          success: false,
        });
      }
      user.phoneNumber = Number(digitsOnly);
    }
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    if (resumeFile) {
      const resumeUri = getDataUri(resumeFile);
      const resumeUpload = await cloudinary.uploader.upload(resumeUri.content, {
        folder: "pdfs",
        resource_type: "auto",
      });
      user.profile.resume = resumeUpload.secure_url;
      user.profile.resumeOriginalName = resumeFile.originalname;
    }

    if (photoFile) {
      const photoUri = getDataUri(photoFile);
      const photoUpload = await cloudinary.uploader.upload(photoUri.content, {
        folder: "profile_photos",
      });
      user.profile.profilePhoto = photoUpload.secure_url;
    }

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error during profile update",
      success: false,
    });
  }
};


export const savedAllJobs = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const jobId = req.params.id;

    
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Invalid Job ID",
        success: false,
      });
    }

    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

   
    if (user.savedJobs.includes(jobId)) {
      await User.findByIdAndUpdate(loggedInUserId, {
        $pull: { savedJobs: jobId },
      });
      return res.status(200).json({
        message: `${user.fullname} unsave jobs`,
        success: true,
      });
    } else {
      
      await User.findByIdAndUpdate(loggedInUserId, {
        $push: { savedJobs: jobId },
      });
      return res.status(200).json({
        message: `${user.fullname} saved job`,
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};


export const getAllSavedJobs = async (req, res) => {
  try {
    const loggedInUserId = req.id;

    const user = await User.findById(loggedInUserId).populate({
      path: "savedJobs",
      select: "title description position jobType salary createdAt company",
      populate: { path: "company", select: "name location logo" },
    }); 

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

   
    return res.status(200).json({
      message: "Saved jobs retrieved successfully",
      success: true,
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    console.log(error);
  }
};


export const googleLogin = async (req, res) => {
  try {
    const code = req.query.code;

    console.log("Received Google code:", code);

    const redirectUri = process.env.GOOGLE_REDIRECT_URI || "postmessage";

    
    const tokenParams = new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const { data: tokenData } = await axios.post(
      "https://oauth2.googleapis.com/token",
      tokenParams,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    console.log("Token Data:", tokenData);

    const { access_token, id_token } = tokenData;

    
    const { data: googleUser } = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    console.log("Google User:", googleUser);

    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = await User.create({
        fullname: googleUser.name,
        email: googleUser.email,
        password: "google-signin", 
        phoneNumber: 1234567890, 
        role: "student", 
        profile: {
          profilePhoto: googleUser.picture,
        },
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 1 * 24 * 60 * 60 * 1000, 
      })
      .status(200)
      .json({
        message: "Google login successful",
        success: true,
        token,
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
      });
  } catch (error) {
    console.error("Google Login Error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Internal Server Error during Google login",
      error: error.response?.data || error.message,
    });
  }
};
