import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Page from "../models/Pages.js";
import Role from "../models/Roles.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

// =====================================================
// FILE PATH
// =====================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================
// LOAD NAVIGATION
// =====================================================

const loadNavigation = () => {
  try {
    const filePath = path.join(__dirname, "navigation.json");

    const file = fs.readFileSync(filePath, "utf-8");

    return JSON.parse(file);
  } catch (error) {
    console.error("❌ Failed to load navigation.json");
    throw error;
  }
};

// =====================================================
// SEED PAGES
// =====================================================

const seedPages = async () => {
  const navigation = loadNavigation();

  if (!navigation.pages || !Array.isArray(navigation.pages)) {
    throw new Error("navigation.json must contain a pages array");
  }

  const pages = [];

    for (const pageData of navigation.pages) {
      
    const data = {
  section: pageData.section,
  name: pageData.name,
  icon: pageData.icon,
  path: pageData.path,
  description: pageData.description || "",
  status: "active",
  is_visible: "yes",
};

    let page = await Page.findOne({
      name: data.name,
    });

    if (page) {
      page.set(data);
      await page.save();

      console.log(`🔄 Page updated: ${page.name}`);
    } else {
      page = await Page.create(data);

      console.log(`✅ Page created: ${page.name}`);
    }

    pages.push(page);
  }

  console.log(`📄 Total pages: ${pages.length}`);

  return pages;
};

// =====================================================
// SEED ADMIN ROLE
// =====================================================

const seedAdminRole = async (pages) => {
  const permissions = pages.map((page) => ({
    page_id: page._id,

    actions: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  }));

  let adminRole = await Role.findOne({
    name: "Admin",
  });

  if (adminRole) {
    adminRole.permissions = permissions;
    adminRole.status = "active";

    await adminRole.save();

    console.log("🔄 Admin role updated");
  } else {
    adminRole = await Role.create({
      name: "Admin",
      description: "Administrator with full access to the system",
      permissions,
      status: "active",
    });

    console.log("✅ Admin role created");
  }

  console.log(`🔐 Admin permissions: ${permissions.length} pages`);

  return adminRole;
};

// =====================================================
// SEED ADMIN USER
// =====================================================

const seedAdminUser = async (adminRole) => {
  const email = process.env.ADMIN_EMAIL || "admin@shopsphere.com";

  const password = process.env.ADMIN_PASSWORD || "admin@123";

  let admin = await User.findOne({
    email,
  });

  if (admin) {
    admin.name = "Hassan Ali";
    admin.role_id = adminRole._id;
    admin.isVerified = true;

    await admin.save();

    console.log(`🔄 Admin user updated: ${admin.email}`);

    return admin;
  }
    const hashedPassword = await bcrypt.hash(password, 10);

  admin = await User.create({
    name: "Hassan Ali",
    email,
    password: hashedPassword,
    role_id: adminRole._id,
    isVerified: true,
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  return admin;
};

// =====================================================
// MAIN SEED FUNCTION
// =====================================================

const seed = async () => {
  console.log("\n🌱 Starting ShopSphere database seeding...\n");

  // 1. Pages
  const pages = await seedPages();

  console.log("");

  // 2. Admin role
  const adminRole = await seedAdminRole(pages);

  console.log("");

  // 3. Admin user
  const adminUser = await seedAdminUser(adminRole);

  console.log("\n=================================");
  console.log("🌱 SEEDING COMPLETED");
  console.log("=================================");
  console.log(`📄 Pages: ${pages.length}`);
  console.log(`🔐 Role: ${adminRole.name}`);
  console.log(`👤 Admin: ${adminUser.email}`);
  console.log(`🔑 Role ID: ${adminRole._id}`);
  console.log("=================================\n");

  return {
    pages,
    adminRole,
    adminUser,
  };
};

export default seed;
