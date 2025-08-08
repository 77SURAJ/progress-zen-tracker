import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface ProgressSphereProps {
  value: number; // 0 - 100
  height?: number;
}

function AnimatedSphereMesh({ value }: { value: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    meshRef.current.rotation.y += 0.01;
  });

  // Map 0..100 -> 0.8..1.3 scale
  const scale = 0.8 + (Math.min(Math.max(value, 0), 100) / 100) * 0.5;

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={scale}>
        <MeshDistortMaterial
          color="#3b82f6"
          distort={0.25}
          speed={1.8}
          roughness={0.15}
          metalness={0.7}
        />
      </Sphere>
    </Float>
  );
}

export function ProgressSphere({ value, height = 220 }: ProgressSphereProps) {
  return (
    <div className="relative rounded-xl overflow-hidden bg-card/40 border border-border" style={{ height }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <AnimatedSphereMesh value={value} />
      </Canvas>
      <div className="absolute bottom-3 inset-x-0 text-center">
        <div className="text-xs text-muted-foreground">Overall Progress</div>
        <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {Math.round(value)}%
        </div>
      </div>
    </div>
  );
}
