import { Request, Response } from 'express';
import { db } from '../models/db';
import { UserProfile } from '../types';

export const register = (req: Request, res: Response): any => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Please supply all required fields (email, name, password)' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists' });
    }

    const newUser: UserProfile = {
      id: 'usr-' + Math.random().toString(36).substring(2, 11),
      email: email.trim().toLowerCase(),
      name: name.trim(),
      role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
      plan: 'free',
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser, password);
    res.status(201).json({ user: newUser, token: `mock-token-${newUser.id}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const login = (req: Request, res: Response): any => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'No user account found with that email' });
    }

    const savedPassword = db.getUserPassword(user.id);
    if (savedPassword !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    db.addLog(user.id, user.email, 'User Login', 'Successfully logged in');
    res.json({ user, token: `mock-token-${user.id}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getProfile = (req: Request, res: Response): any => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer mock-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = authHeader.replace('Bearer mock-token-', '');
  const users = db.getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
};
