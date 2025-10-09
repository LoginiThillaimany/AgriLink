import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub).select('_id name email');
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = { id: user._id.toString(), name: user.name, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};


