/**
 * Role-Based Authorization Middleware
 * ====================================
 * Restricts access to routes based on user roles.
 * Must be used AFTER the authenticate middleware.
 *
 * @param {...string} allowedRoles - The roles permitted to access the route
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated (req.user is set by authenticate)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user found in request",
      });
    }

    // Check if user role is in the allowed list
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${allowedRoles.join(", ")}]`,
      });
    }

    next();
  };
};
