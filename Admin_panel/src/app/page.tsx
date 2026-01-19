"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  ShieldCheck,
  Activity,
  TrendingUp,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Cpu
} from 'lucide-react';
import { adminService, AdminStats } from '@/services/adminService';
import { Card } from '@/components/ui/Card';
import AdminLayout from '@/components/AdminLayout';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.total_users || 0,
      icon: Users,
      color: 'text-primary-500',
      bg: 'bg-primary-500/10',
      trend: '+12%',
      isUp: true
    },
    {
      title: 'AI Interactions',
      value: stats?.ai_features_used || 0,
      icon: Zap,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      trend: '+45%',
      isUp: true
    },
    {
      title: 'Active Today',
      value: stats?.active_users || 0,
      icon: Activity,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      trend: '-2%',
      isUp: false
    },
    {
      title: 'System Volume',
      value: `₹${(stats?.total_amount || 0).toLocaleString()}`,
      icon: Cpu,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      trend: '+8%',
      isUp: true
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-10">
        <header>
          <h1 className="text-4xl font-black text-white tracking-tight">Admin Overview</h1>
          <p className="text-gray-400 mt-1 font-medium italic">"Neural metrics for the HisabKitab ecosystem."</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-6 relative group border-white/5 hover:border-primary-500/30 transition-all overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${card.bg} transition-transform group-hover:scale-110`}>
                      <Icon size={24} className={card.color} />
                    </div>
                    <div className={`flex items-center space-x-1 text-[10px] font-bold px-2 py-1 rounded-full ${card.isUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {card.isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                      <span>{card.trend}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{card.title}</p>
                    <h3 className="text-3xl font-black text-white tracking-tighter">{card.value}</h3>
                  </div>
                  <div className="absolute -right-2 -bottom-2 h-16 w-16 bg-white/5 rounded-full blur-2xl group-hover:bg-primary-500/5 transition-all" />
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-8 border-white/5 min-h-[400px] flex flex-col justify-center items-center text-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-gray-800/50 flex items-center justify-center border border-white/5">
              <TrendingUp className="text-gray-600" size={40} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">System Growth Chart</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">Neural visualization of user registration trends and AI adoption rates will appear here.</p>
            </div>
          </Card>

          <Card className="p-8 border-white/5 flex flex-col items-center justify-center text-center space-y-4">
            <ShieldCheck className="text-primary-500" size={48} />
            <h3 className="text-xl font-bold text-white">Security Health</h3>
            <div className="w-full space-y-3">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-400">Auth Integrity</span>
                <span className="text-green-500 font-bold">100%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-full bg-green-500 rounded-full" />
              </div>
              <div className="flex justify-between text-xs font-medium pt-2">
                <span className="text-gray-400">Database Uptime</span>
                <span className="text-green-500 font-bold">99.9%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-[99.9%] bg-primary-500 rounded-full" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
