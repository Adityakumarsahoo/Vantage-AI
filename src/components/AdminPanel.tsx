import React, { useEffect, useState } from 'react';
import { Users, FileText, Activity, ShieldCheck, Cpu, Database, AlertCircle, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types';

interface AdminStats {
  totalUsers: number;
  totalReports: number;
  totalLogs: number;
  averageScore: number;
  plansCount: {
    free: number;
    pro: number;
    enterprise: number;
  };
}

interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  email: string;
  action: string;
  details: string;
}

interface AdminPanelProps {
  isDark: boolean;
}

export default function AdminPanel({ isDark }: AdminPanelProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const statsRes = await fetch('/api/admin/stats');
      const usersRes = await fetch('/api/admin/users');
      const logsRes = await fetch('/api/admin/logs');

      if (!statsRes.ok || !usersRes.ok || !logsRes.ok) {
        throw new Error('Failed to load administrative dataset');
      }

      setStats(await statsRes.json());
      setUsers(await usersRes.json());
      setLogs(await logsRes.json());
    } catch (err: any) {
      setError(err.message || 'Error occurred loading admin panel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
        <p className="text-sm text-slate-400">Loading system administration dataset...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div>
          <h4 className="font-bold">Admin Module Error</h4>
          <p className="text-xs mt-0.5">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Registered Users</p>
              <h4 className="text-2xl font-black mt-1.5">{stats?.totalUsers || 0}</h4>
            </div>
            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex gap-2 text-[11px] font-medium text-slate-400">
            <span className="text-indigo-400">{stats?.plansCount.pro || 0} Pro</span> • 
            <span className="text-emerald-500">{stats?.plansCount.enterprise || 0} Enterprise</span>
          </div>
        </div>

        <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Audited Scans Reports</p>
              <h4 className="text-2xl font-black mt-1.5">{stats?.totalReports || 0}</h4>
            </div>
            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-500">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-[11px] text-slate-400 font-medium">Accumulating historical crawl inputs</p>
        </div>

        <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Average Crawl Score</p>
              <h4 className="text-2xl font-black mt-1.5">{stats?.averageScore || 0}%</h4>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-[11px] text-slate-400 font-medium">Optimal W3C & Core Web audits</p>
        </div>

        <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Platform Health</p>
              <h4 className="text-2xl font-black mt-1.5 text-emerald-500">99.98%</h4>
            </div>
            <div className="p-3 rounded-lg bg-[#16161a] text-indigo-400">
              <Cpu className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex gap-1.5 items-center text-[10px] text-emerald-500 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            Vite Engine Live • Node 22
          </div>
        </div>
      </div>

      {/* Admin Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Management */}
        <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-4.5 w-4.5 text-slate-400" />
              <h3 className="font-bold text-sm">System Users Account</h3>
            </div>
            <button 
              id="refresh-admin-users"
              onClick={fetchAdminData}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4 text-slate-400" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                  <th className="py-2.5 font-bold">User</th>
                  <th className="py-2.5 font-bold">Plan Level</th>
                  <th className="py-2.5 font-bold">Join Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="py-2.5 font-semibold">
                      <div>{u.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{u.email}</div>
                    </td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.plan === 'enterprise' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        u.plan === 'pro' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400 font-mono text-[10px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log / Security Logs */}
        <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Database className="h-4.5 w-4.5 text-slate-400" />
              <h3 className="font-bold text-sm">Security & Activity Log</h3>
            </div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-bold uppercase">
              Audits
            </span>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {logs.map(l => (
              <div 
                key={l.id}
                className={`p-3 rounded-lg border flex gap-3 items-start transition-all ${
                  isDark ? 'bg-[#16161a] border-slate-800/50 hover:bg-[#111114]' : 'bg-slate-50 border-slate-100 hover:bg-slate-100/50'
                }`}
              >
                <div className={`p-1.5 rounded text-xs shrink-0 ${
                  l.action.includes('Upgrade') || l.action.includes('Register') ? 'bg-emerald-500/10 text-emerald-500' :
                  l.action.includes('Scan') ? 'bg-indigo-500/10 text-indigo-400' :
                  'bg-slate-500/10 text-slate-400'
                }`}>
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-xs text-slate-300 dark:text-slate-100">{l.action}</span>
                    <span className="font-mono text-[9px] text-slate-400">{new Date(l.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{l.details}</p>
                  <p className="text-[9px] text-slate-400 font-mono">By: {l.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
