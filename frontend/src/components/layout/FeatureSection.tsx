import React from 'react';
import { Card } from '@/components/ui';
import { Brain, Zap, Shield, BarChart3, Cloud, Mic } from 'lucide-react';

export const FeatureSection = () => {
    const features = [
        {
            title: 'AI Insights',
            description: 'Get personalized financial advice powered by Google Gemini.',
            icon: <Brain className="h-8 w-8 text-primary-500" />
        },
        {
            title: 'Voice Input',
            description: 'Log expenses naturally using your voice with Whisper integration.',
            icon: <Mic className="h-8 w-8 text-secondary-500" />
        },
        {
            title: 'Real-time Analytics',
            description: 'Visualize your spending habits with interactive 3D charts.',
            icon: <BarChart3 className="h-8 w-8 text-green-500" />
        },
        {
            title: 'Smart Budgets',
            description: 'Receive instant alerts when you approach your spending limits.',
            icon: <Zap className="h-8 w-8 text-yellow-500" />
        },
        {
            title: 'Secure & Private',
            description: 'Your data is encrypted and protected with industry-standard security.',
            icon: <Shield className="h-8 w-8 text-blue-500" />
        },
        {
            title: 'Cloud Sync',
            description: 'Access your finances from any device with seamless cloud synchronization.',
            icon: <Cloud className="h-8 w-8 text-purple-500" />
        },
    ];

    return (
        <section className="py-24 w-full">
            <div className="space-y-4 text-center mb-16">
                <h2 className="text-4xl font-bold text-white">Powerful Features</h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    Everything you need to master your money in one place.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
                {features.map((feature, idx) => (
                    <Card key={idx} className="group hover:-translate-y-1 transition-transform cursor-default">
                        <div className="mb-6 p-4 rounded-2xl bg-gray-800/50 w-fit group-hover:bg-gray-800 transition-colors">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-400 leading-relaxed">
                            {feature.description}
                        </p>
                    </Card>
                ))}
            </div>
        </section>
    );
};
