// pages/api/users/profile.js
import dbConnect from '../../../utils/dbConnect';
import {User} from '../../../models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Replace 'YOUR_SECRET_KEY' with your actual secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await dbConnect();

    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
}
