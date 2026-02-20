"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const RING_COLOR = "#0b84e3"; // primary-500
const ACCENT = "#6366f1"; // accent indigo

function FloatingRing({ position, scale = 1, speed = 1 }: { position: [number, number, number]; scale?: number; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    ref.current.rotation.x = t * 0.15;
    ref.current.rotation.y = t * 0.2;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusGeometry args={[1.2, 0.03, 16, 100]} />
      <meshBasicMaterial color={RING_COLOR} transparent opacity={0.25} />
    </mesh>
  );
}

function FloatingRingAccent({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * 0.1;
    ref.current.rotation.z = t * 0.12;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusGeometry args={[0.8, 0.02, 12, 64]} />
      <meshBasicMaterial color={ACCENT} transparent opacity={0.2} />
    </mesh>
  );
}

function WireframeIcosahedron() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.3;
    ref.current.rotation.x = t * 0.2;
    ref.current.rotation.y = t * 0.25;
  });
  return (
    <mesh ref={ref} position={[3, 1, -6]}>
      <icosahedronGeometry args={[0.6, 0]} />
      <meshBasicMaterial color={RING_COLOR} wireframe transparent opacity={0.12} />
    </mesh>
  );
}

function ParticleField() {
  const count = 80;
  const [positions] = React.useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 20;
      pos[i + 1] = (Math.random() - 0.5) * 20;
      pos[i + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    return pos;
  });
  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color={RING_COLOR} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function SceneContent() {
  return (
    <>
      <color attach="background" args={["#050505"]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[4, 4, 4]} intensity={0.6} color={RING_COLOR} />
      <pointLight position={[-4, -2, 2]} intensity={0.3} color={ACCENT} />

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
        <FloatingRing position={[-2.5, 1.2, -4]} scale={0.9} speed={0.6} />
      </Float>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        <FloatingRing position={[2.2, -0.8, -5]} scale={0.7} speed={0.8} />
      </Float>
      <Float speed={1.2} rotationIntensity={0.6} floatIntensity={0.5}>
        <FloatingRingAccent position={[0, 1.8, -6]} scale={0.5} />
      </Float>

      <WireframeIcosahedron />
      <ParticleField />
    </>
  );
}

export function AuthScene3D() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
