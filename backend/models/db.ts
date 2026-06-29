import fs from 'fs';
import path from 'path';
import { ReportData, UserProfile } from '../types';

const DB_FILE = path.join(process.cwd(), 'db_data.json');

interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  email: string;
  action: string;
  details: string;
}

interface DatabaseSchema {
  users: UserProfile[];
  passwords: Record<string, string>; // userId -> hash/password
  reports: ReportData[];
  logs: ActivityLog[];
}

const defaultDb: DatabaseSchema = {
  users: [
    {
      id: 'admin-user',
      email: 'toadityakumarsahoo@gmail.com',
      name: 'Aditya Sahoo',
      role: 'admin',
      plan: 'enterprise',
      createdAt: new Date().toISOString()
    }
  ],
  passwords: {
    'admin-user': 'admin123'
  },
  reports: [],
  logs: [
    {
      id: 'log-1',
      timestamp: new Date().toISOString(),
      userId: 'admin-user',
      email: 'toadityakumarsahoo@gmail.com',
      action: 'System Init',
      details: 'Database initialized successfully'
    }
  ]
};

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
      return defaultDb;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file, using fallback', err);
    return defaultDb;
  }
}

function writeDb(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database file', err);
  }
}

export const db = {
  getUsers(): UserProfile[] {
    return readDb().users;
  },

  getUserByEmail(email: string): UserProfile | undefined {
    return readDb().users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  getUserPassword(userId: string): string | undefined {
    return readDb().passwords[userId];
  },

  createUser(user: UserProfile, passwordStr: string): UserProfile {
    const database = readDb();
    database.users.push(user);
    database.passwords[user.id] = passwordStr;
    writeDb(database);
    this.addLog(user.id, user.email, 'User Register', `Successfully registered as ${user.plan} plan`);
    return user;
  },

  updateUserPlan(userId: string, plan: 'free' | 'pro' | 'enterprise'): UserProfile | null {
    const database = readDb();
    const user = database.users.find(u => u.id === userId);
    if (user) {
      user.plan = plan;
      writeDb(database);
      this.addLog(userId, user.email, 'Subscription Upgrade', `Upgraded plan to ${plan}`);
      return user;
    }
    return null;
  },

  getReports(userId?: string): ReportData[] {
    const database = readDb();
    return database.reports;
  },

  getReportById(id: string): ReportData | undefined {
    return readDb().reports.find(r => r.id === id);
  },

  saveReport(report: ReportData, userId?: string, email?: string) {
    const database = readDb();
    database.reports = database.reports.filter(r => r.id !== report.id);
    database.reports.unshift(report);
    writeDb(database);
    if (userId && email) {
      this.addLog(userId, email, 'Scan Completed', `Analyzed website: ${report.url}`);
    }
  },

  deleteReport(id: string, userId?: string, email?: string): boolean {
    const database = readDb();
    const originalCount = database.reports.length;
    database.reports = database.reports.filter(r => r.id !== id);
    writeDb(database);
    if (userId && email) {
      this.addLog(userId, email, 'Delete Report', `Deleted scan report ${id}`);
    }
    return database.reports.length < originalCount;
  },

  getLogs(): ActivityLog[] {
    return readDb().logs;
  },

  addLog(userId: string, email: string, action: string, details: string) {
    const database = readDb();
    const newLog: ActivityLog = {
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      userId,
      email,
      action,
      details
    };
    database.logs.unshift(newLog);
    if (database.logs.length > 100) {
      database.logs = database.logs.slice(0, 100);
    }
    writeDb(database);
  }
};
