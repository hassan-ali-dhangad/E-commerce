import Role from "../models/Roles.js";
import Page from "../models/Pages.js";

// =====================================================
// CLEAN ROLE PERMISSIONS
// =====================================================

const cleanRolePermissions = async (permissions = []) => {
  // Get all active pages
  const pages = await Page.find({
    status: "active",
  }).select("_id");

  // Create a set of valid page IDs
  const validPageIds = new Set(pages.map((page) => page._id.toString()));

  // Clean permissions
  return (
    permissions
      // -------------------------------------------------
      // Only allow valid pages
      // -------------------------------------------------
      .filter((permission) => {
        return validPageIds.has(permission.page_id?.toString());
      })

      // -------------------------------------------------
      // Remove pages where ALL permissions are false
      // -------------------------------------------------
      .filter((permission) => {
        const actions = permission.actions || {};

        return (
          Boolean(actions.create) ||
          Boolean(actions.read) ||
          Boolean(actions.update) ||
          Boolean(actions.delete)
        );
      })

      // -------------------------------------------------
      // Format permission data
      // -------------------------------------------------
      .map((permission) => ({
        page_id: permission.page_id,

        actions: {
          create: Boolean(permission.actions?.create),
          read: Boolean(permission.actions?.read),
          update: Boolean(permission.actions?.update),
          delete: Boolean(permission.actions?.delete),
        },
      }))
  );
};

// =====================================================
// GET ALL ROLES
// =====================================================

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find()
      .populate("permissions.page_id")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      roles,
    });
  } catch (error) {
    console.error("Get roles error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch roles",
    });
  }
};

// =====================================================
// GET ROLE BY ID
// =====================================================

export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).populate(
      "permissions.page_id",
    );

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    res.status(200).json({
      success: true,
      role,
    });
  } catch (error) {
    console.error("Get role error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch role",
    });
  }
};

// =====================================================
// CREATE ROLE
// =====================================================

export const createRole = async (req, res) => {
  try {
    const { name, description, permissions, status } = req.body;

    // -------------------------------------------------
    // VALIDATE ROLE NAME
    // -------------------------------------------------

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Role name is required",
      });
    }

    // -------------------------------------------------
    // CHECK DUPLICATE ROLE
    // -------------------------------------------------

    const existingRole = await Role.findOne({
      name: name.trim(),
    });

    if (existingRole) {
      return res.status(409).json({
        success: false,
        message: "Role already exists",
      });
    }

    // -------------------------------------------------
    // CLEAN PERMISSIONS
    // -------------------------------------------------

    const cleanPermissions = await cleanRolePermissions(
      Array.isArray(permissions) ? permissions : [],
    );

    // -------------------------------------------------
    // CREATE ROLE
    // -------------------------------------------------

    const role = await Role.create({
      name: name.trim(),

      description: description?.trim() || "",

      permissions: cleanPermissions,

      status: status === "inactive" ? "inactive" : "active",
    });

    // -------------------------------------------------
    // POPULATE PAGE DETAILS
    // -------------------------------------------------

    const populatedRole = await Role.findById(role._id).populate(
      "permissions.page_id",
    );

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      role: populatedRole,
    });
  } catch (error) {
    console.error("Create role error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create role",
    });
  }
};

// =====================================================
// UPDATE ROLE
// =====================================================

export const updateRole = async (req, res) => {
  try {
    const { name, description, permissions, status } = req.body;

    // -------------------------------------------------
    // FIND ROLE
    // -------------------------------------------------

    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // -------------------------------------------------
    // UPDATE ROLE NAME
    // -------------------------------------------------

    if (name?.trim()) {
      const duplicate = await Role.findOne({
        name: name.trim(),

        _id: {
          $ne: role._id,
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Another role with this name already exists",
        });
      }

      role.name = name.trim();
    }

    // -------------------------------------------------
    // UPDATE DESCRIPTION
    // -------------------------------------------------

    if (description !== undefined) {
      role.description = description?.trim() || "";
    }

    // -------------------------------------------------
    // UPDATE PERMISSIONS
    // -------------------------------------------------

    if (Array.isArray(permissions)) {
      role.permissions = await cleanRolePermissions(permissions);
    }

    // -------------------------------------------------
    // UPDATE STATUS
    // -------------------------------------------------

    if (status === "active" || status === "inactive") {
      role.status = status;
    }

    // -------------------------------------------------
    // SAVE ROLE
    // -------------------------------------------------

    await role.save();

    // -------------------------------------------------
    // GET UPDATED ROLE
    // -------------------------------------------------

    const updatedRole = await Role.findById(role._id).populate(
      "permissions.page_id",
    );

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      role: updatedRole,
    });
  } catch (error) {
    console.error("Update role error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update role",
    });
  }
};

// =====================================================
// DELETE ROLE
// =====================================================

export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    // -------------------------------------------------
    // CHECK ROLE EXISTS
    // -------------------------------------------------

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // -------------------------------------------------
    // PREVENT ADMIN ROLE DELETION
    // -------------------------------------------------

    if (role.name.toLowerCase() === "admin") {
      return res.status(400).json({
        success: false,
        message: "The Admin role cannot be deleted",
      });
    }

    // -------------------------------------------------
    // DELETE ROLE
    // -------------------------------------------------

    await Role.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    console.error("Delete role error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete role",
    });
  }
};
