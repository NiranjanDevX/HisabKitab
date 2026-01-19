"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShapes = () => {
    return (
        <>
            <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                <Sphere args={[1, 64, 64]} position={[-3, 2, -5]}>
                    <MeshDistortMaterial
                        color="#4f46e5"
                        speed={3}
                        distort={0.4}
                        radius={1}
                    />
                </Sphere>
            </Float>
            <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
                <mesh position={[4, -2, -6]}>
                    <octahedronGeometry args={[1.5, 0]} />
                    <meshStandardMaterial color="#06b6d4" wireframe />
                </mesh>
            </Float>
            <Float speed={3} rotationIntensity={1.5} floatIntensity={1}>
                <mesh position={[0, -3, -8]}>
                    <torusGeometry args={[2, 0.4, 16, 100]} />
                    <meshStandardMaterial color="#ec4899" />
                </mesh>
            </Float>
        </>
    );
};

const AnimatedCore = () => {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.2;
        meshRef.current.rotation.y = time * 0.3;
    });

    return (
        <mesh ref={meshRef} position={[0, 0, -2]}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial
                color="#ffffff"
                wireframe
                transparent
                opacity={0.1}
            />
        </mesh>
    );
};

export const Hero3D = () => {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#4f46e5" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#ec4899" />

                <FloatingShapes />
                <AnimatedCore />

                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};
