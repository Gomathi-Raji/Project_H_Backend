import User from "../models/User.js";
import Tenant from "../models/Tenant.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, phone, password: hashed, role });

    // If user is a tenant, create a tenant record
    let tenant = null;
    if (role === 'tenant') {
      tenant = await Tenant.create({
        userId: user._id,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
        email,
        phone,
        active: false // Mark as inactive until onboarding is complete
      });

      // Update user with tenantId reference
      user.tenantId = tenant._id;
      await user.save();
    }

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      tenantId: user.tenantId,
      requiresOnboarding: role === 'tenant' && !tenant?.room, // Flag for onboarding
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // Check if this is first login
    const isFirstLogin = user.isFirstLogin;

    // Check if tenant requires onboarding (no room assigned)
    let requiresOnboarding = false;
    if (user.role === 'tenant' && user.tenantId) {
      const tenant = await Tenant.findById(user.tenantId);
      requiresOnboarding = !tenant?.room;
    }

    // Update first login status if it's true
    if (isFirstLogin) {
      user.isFirstLogin = false;
      await user.save();
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isFirstLogin: isFirstLogin,
      requiresOnboarding: requiresOnboarding,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    // In a JWT-based auth system, logout is handled client-side by removing the token
    // However, you can implement token blacklisting or session invalidation here if needed
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserTenant = async (req, res) => {
  const { userId, tenantId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { tenantId }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phone },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserSettings = async (req, res) => {
  try {
    const { theme, notifications } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        settings: { theme, notifications }
      },
      { new: true, upsert: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Settings updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
