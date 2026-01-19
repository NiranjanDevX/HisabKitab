"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import Link from 'next/link';

const AnimatedSphere = () => {
    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere args={[1, 100, 100]} scale={2.4}>
                <MeshDistortMaterial
                    color="#8b5cf6"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    );
};

export const MainHero = () => {
    return (
        <div className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-20 overflow-hidden">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                    <Suspense fallback={null}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1} />
                        <pointLight position={[-10, -10, -5]} intensity={0.5} />
                        <AnimatedSphere />
                        <OrbitControls enableZoom={false} autoRotate />
                    </Suspense>
                </Canvas>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center space-y-8 max-w-4xl px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
                        Revolutionize Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
                            Personal Finances
                        </span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-xl text-gray-400 max-w-2xl mx-auto"
                >
                    AI-powered insights, real-time tracking, and stunning 3D visualizations.
                    Manage your money like never before with HisabKitab.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
                >
                    <Link href="/register">
                        <Button size="lg" className="w-full sm:w-auto px-10">Get Started Free</Button>
                    </Link>
                    <Link href="/login">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto px-10">Sign In</Button>
                    </Link>
                </motion.div>
            </div>

            {/* Down arrow indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10"
            >
                <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center p-1">
                    <div className="w-1 h-3 bg-gray-600 rounded-full"></div>
                </div>
            </motion.div>
        </div>
    );
};
