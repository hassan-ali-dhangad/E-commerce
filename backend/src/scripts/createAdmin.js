import bcrypt from "bcryptjs";
import User from "../models/User.js";

const createAdmin = async () => {
  try {
    const email = "admin@shopsphere.com";
    const password = "admin@123";

    const existingAdmin = await User.findOne({
      email,
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: "Hassan Ali",
      email,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    console.log("Admin created successfully:");
    console.log(admin.email);
  } catch (error) {
    console.error("Failed to create admin:", error.message);

    throw error;
  }
};

export default createAdmin;
