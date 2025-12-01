import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password").populate("tenantId");
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};

export const staffOnly = (req, res, next) => {
  if (req.user && (req.user.role === "staff" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403).json({ message: "Staff access required" });
  }
};

export const tenantOnly = (req, res, next) => {
  if (req.user && req.user.role === "tenant") {
    next();
  } else {
    res.status(403).json({ message: "Tenant access required" });
  }
};
