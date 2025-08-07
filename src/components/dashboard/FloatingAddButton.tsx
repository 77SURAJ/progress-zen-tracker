import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';

interface FloatingOrbProps {
  onClick: () => void;
}

function FloatingOrb({ onClick }: FloatingOrbProps) {
  const orbRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      orbRef.current.rotation.x += 0.01;
      orbRef.current.rotation.y += 0.01;
    }
    
    if (glowRef.current) {
      glowRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 3) * 0.1 + (hovered ? 0.2 : 0)
      );
    }
  });

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Glow effect */}
      <Sphere ref={glowRef} args={[0.8, 32, 32]}>
        <meshBasicMaterial 
          color="#3b82f6" 
          transparent 
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Main orb */}
      <Sphere ref={orbRef} args={[0.5, 32, 32]}>
        <meshStandardMaterial 
          color="#3b82f6"
          emissive="#1e40af"
          emissiveIntensity={hovered ? 0.3 : 0.1}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      
      {/* Plus icon */}
      <Text
        position={[0, 0, 0.6]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        +
      </Text>
    </group>
  );
}

interface FloatingAddButtonProps {
  onAddEntry: () => void;
  className?: string;
}

export function FloatingAddButton({ onAddEntry, className = '' }: FloatingAddButtonProps) {
  const [show3D, setShow3D] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence>
        {show3D && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-32 -left-32 w-64 h-64 pointer-events-none"
          >
            <Canvas camera={{ position: [0, 0, 3] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[5, 5, 5]} intensity={1} />
              
              <FloatingOrb onClick={onAddEntry} />
            </Canvas>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onHoverStart={() => setShow3D(true)}
        onHoverEnd={() => setShow3D(false)}
        className="relative"
      >
        <Button
          onClick={onAddEntry}
          size="lg"
          className="rounded-full w-16 h-16 bg-gradient-primary hover:opacity-90 shadow-glow animate-pulse"
          aria-label="Add new progress entry"
        >
          <Plus className="h-6 w-6" />
        </Button>
        
        {/* Pulse rings */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-primary opacity-20"
        />
        <motion.div
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute inset-0 rounded-full bg-primary opacity-10"
        />
      </motion.div>
    </div>
  );
}