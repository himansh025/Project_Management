import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (userId) => {
  console.log(process.env.JWT_SECRET)
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)
    const user = await User.findOne({ email });
    console.log(user)
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },message:"logged in succesfully"
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.json({ message: 'Logged out successfully' });
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getallUsers = async (req, res) => {
  try {
    const user = await User.find().select('-password');
    console.log(user)
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const alluserInfo = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $project: {
          password: 0
        }
      },
      {
        $lookup: {
          from: 'projects',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$$userId', '$users']
                }
              }
            }
          ],
          as: 'projects'
        }
      },
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'assignedTo',
          as: 'tasks'
        }
      }
    ]);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getusername = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'UserId not provided' });
    }

    const user = await User.findOne({ _id: userId }).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ name: user.name, message: "Username fetched successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
