import React, { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron } from "@react-three/drei";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";

interface ParticlesCelebrationProps {
  active: boolean;
  durationMs?: number;
  onComplete?: () => void;
}

function Burst({ seed = 0 }: { seed?: number }) {
  const group = useRef<THREE.Group>(null);
  const particles = useMemo(() => {
    const arr = [] as Array<{ pos: THREE.Vector3; vel: THREE.Vector3; rot: THREE.Euler; scale: number }>;
    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    for (let i = 0; i < 40; i++) {
      const dir = new THREE.Vector3(rand(-1, 1), rand(0.5, 1.5), rand(-1, 1)).normalize();
      const speed = rand(1, 3);
      arr.push({
        pos: new THREE.Vector3(0, 0, 0),
        vel: dir.multiplyScalar(speed),
        rot: new THREE.Euler(rand(0, Math.PI), rand(0, Math.PI), rand(0, Math.PI)),
        scale: rand(0.08, 0.18),
      });
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  useFrame((state, delta) => {
    if (!group.current) return;
    let i = 0;
    group.current.children.forEach((child) => {
      const p = particles[i++];
      child.position.addScaledVector(p.vel, delta);
      child.rotation.x += delta * 2;
      child.rotation.y += delta * 1.5;
      // Gravity
      p.vel.y -= delta * 1.5;
      // Fade out by scaling down a bit over time
      child.scale.multiplyScalar(1 - delta * 0.3);
    });
  });

  return (
    <group ref={group}>
      {particles.map((p, idx) => (
        <Icosahedron key={idx} args={[1, 0]} position={p.pos.toArray()} rotation={[p.rot.x, p.rot.y, p.rot.z]} scale={p.scale}>
          <meshStandardMaterial color="#f59e0b" emissive="#fbbf24" emissiveIntensity={0.3} />
        </Icosahedron>
      ))}
    </group>
  );
}

export function ParticlesCelebration({ active, durationMs = 2500, onComplete }: ParticlesCelebrationProps) {
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => onComplete?.(), durationMs);
    return () => clearTimeout(t);
  }, [active, durationMs, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 pointer-events-none z-50"
          aria-hidden
        >
          <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[5, 5, 5]} intensity={1} />
            <Burst />
          </Canvas>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
