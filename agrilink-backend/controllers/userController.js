import User from "../models/User.js";
import bcrypt from "bcryptjs";

const USER_ID = '64a1b2c3d4e5f6g7h8i9j0k1'; // Mock user ID

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(USER_ID);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(USER_ID, { name, phone }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { name, email, password, role, phone } = req.body;
    console.log('Extracted phone:', phone);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const userData = { name, email, password: hashedPassword, role, phone };
    console.log('User data to save:', userData);
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered successfully', userId: savedUser._id });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // In real app, generate JWT token
    res.json({
      message: 'Login successful',
      userId: user._id,
      role: user.role,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};