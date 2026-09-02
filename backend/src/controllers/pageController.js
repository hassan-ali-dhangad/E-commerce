import Page from "../models/Pages.js";
import Role from "../models/Roles.js";

// =====================================================
// GET PAGES FOR LOGGED-IN USER
// =====================================================

export const getPages = async (req, res) => {
  try {
    // ================================================
    // CHECK AUTHENTICATED USER
    // ================================================

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ================================================
    // CHECK USER ROLE
    // ================================================

    if (!user.role_id) {
      return res.status(403).json({
        success: false,
        message: "User does not have a role assigned",
      });
    }

    // ================================================
    // GET ROLE WITH PERMISSIONS
    // ================================================

    const role = await Role.findById(user.role_id).populate({
      path: "permissions.page_id",
      match: {
        status: "active",
        is_visible: "yes",
      },
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // ================================================
    // CHECK ROLE STATUS
    // ================================================

    if (role.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "This role is inactive",
      });
    }

    // ================================================
    // GET ONLY PAGES USER CAN READ
    // ================================================

    const allowedPages = role.permissions
      .filter((permission) => {
        return (
          permission.page_id &&
          permission.actions &&
          permission.actions.read === true
        );
      })
      .map((permission) => {
        return {
          ...permission.page_id.toObject(),

          // Optional permission actions
          permissions: {
            create: permission.actions.create,
            read: permission.actions.read,
            update: permission.actions.update,
            delete: permission.actions.delete,
          },
        };
      });

    // ================================================
    // SORT BY CREATED DATE
    // ================================================

    allowedPages.sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    // ================================================
    // RESPONSE
    // ================================================

    res.status(200).json({
      success: true,
      role: {
        _id: role._id,
        name: role.name,
      },
      pages: allowedPages,
    });
  } catch (error) {
    console.error("Get pages error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user pages",
    });
  }
};

// =====================================================
// GET PAGE BY ID
// =====================================================

export const getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    res.status(200).json({
      success: true,
      page,
    });
  } catch (error) {
    console.error("Get page error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch page",
    });
  }
};
