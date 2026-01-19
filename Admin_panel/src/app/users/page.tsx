"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    UserCheck,
    UserX,
    Search,
    Mail,
    Calendar,
    Activity
} from 'lucide-react';
import Image from 'next/image';
import { adminService, AdminUser } from '@/services/adminService';
import { useNotification } from '@/context/NotificationContext';
import { Card } from '@/components/ui/Card';
import AdminLayout from '@/components/AdminLayout';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { showNotification } = useNotification();

    const fetchUsers = React.useCallback(async () => {
        try {
            const data = await adminService.getUsers();
            setUsers(Array.isArray(data) ? data : (data as { items: AdminUser[] }).items || []);
        } catch {
            showNotification('Failed to fetch users', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showNotification]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleBanToggle = async (user: AdminUser) => {
        try {
            if (user.is_active) {
                await adminService.banUser(user.id);
                showNotification(`User ${user.email} suspended`, 'success');
            } else {
                await adminService.unbanUser(user.id);
                showNotification(`User ${user.email} reactivated`, 'success');
            }
            fetchUsers();
        } catch {
            showNotification('Action failed', 'error');
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.full_name && u.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AdminLayout>
            <div className="space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">User Base</h1>
                        <p className="text-gray-400 mt-1 font-medium">Manage and monitor account activities.</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search by email..."
                                className="bg-gray-900 border border-white/5 rounded-2xl pl-12 pr-6 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-64 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 bg-linear-to-br from-primary-600/20 to-transparent border-primary-500/20">
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Registered</p>
                                <h3 className="text-2xl font-black text-white">{users.length}</h3>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="overflow-hidden border-white/5 bg-gray-900/50 backdrop-blur-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-gray-800/30">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User Details</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Profile</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Activity</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined At</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-6 py-8 bg-gray-800/10"></td>
                                        </tr>
                                    ))
                                ) : filteredUsers.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                {user.profile_pic ? (
                                                    <div className="relative h-10 w-10">
                                                        <Image
                                                            src={user.profile_pic}
                                                            alt=""
                                                            fill
                                                            className="rounded-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-linear-to-tr from-primary-600 to-secondary-600 flex items-center justify-center text-xs font-black text-white">
                                                        {user.email.substring(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-bold text-white leading-tight">{user.full_name || 'Anonymous'}</p>
                                                    <p className="text-xs text-gray-500 flex items-center mt-1">
                                                        <Mail size={12} className="mr-1" />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white capitalize">{user.occupation || 'N/A'}</span>
                                                <span className="text-[10px] text-gray-500 lowercase">{user.phone_number || 'No phone'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.is_active ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 uppercase tracking-wider">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-500 uppercase tracking-wider">
                                                    Suspended
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white">{user.expense_count || 0} Expenses</span>
                                                <span className="text-[10px] text-gray-500">₹{(user.total_spent || 0).toLocaleString()} spent</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-gray-400 flex items-center">
                                                <Calendar size={12} className="mr-1.5" />
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleBanToggle(user)}
                                                    className={`p-2 rounded-xl transition-all ${user.is_active
                                                        ? 'text-gray-500 hover:bg-red-500/10 hover:text-red-500'
                                                        : 'text-green-500 bg-green-500/10 hover:bg-green-500 hover:text-white'
                                                        }`}
                                                    title={user.is_active ? 'Suspend User' : 'Activate User'}
                                                >
                                                    {user.is_active ? <UserX size={18} /> : <UserCheck size={18} />}
                                                </button>
                                                <button className="p-2 text-gray-500 hover:bg-gray-800 rounded-xl transition-all">
                                                    <Activity size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
