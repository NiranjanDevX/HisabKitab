import React from 'react';
import { Card } from '@/components/ui';
import { ShoppingBag, Coffee, Car, Home, Smartphone, Plus } from 'lucide-react';

interface Transaction {
    id: number;
    description: string;
    amount: number;
    category_name: string;
    date: string;
}

interface RecentTransactionsProps {
    transactions: Transaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
    const getIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'food': return <Coffee className="h-4 w-4" />;
            case 'transport': return <Car className="h-4 w-4" />;
            case 'shopping': return <ShoppingBag className="h-4 w-4" />;
            case 'home': return <Home className="h-4 w-4" />;
            case 'bills': return <Smartphone className="h-4 w-4" />;
            default: return <Plus className="h-4 w-4" />;
        }
    };

    return (
        <Card className="flex-1" title="Recent Transactions">
            <div className="space-y-4">
                {transactions.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No recent transactions found.</p>
                ) : (
                    transactions.map((t) => (
                        <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-800/30 transition-colors group">
                            <div className="flex items-center space-x-4">
                                <div className="p-2.5 rounded-lg bg-gray-800 text-gray-400 group-hover:text-primary-400 group-hover:bg-primary-500/10 transition-colors">
                                    {getIcon(t.category_name)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{t.description}</p>
                                    <p className="text-xs text-gray-500">{t.category_name} • {new Date(t.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-white">₹{t.amount.toLocaleString()}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};
