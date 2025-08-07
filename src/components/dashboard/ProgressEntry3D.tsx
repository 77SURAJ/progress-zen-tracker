import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface ProgressEntry3DProps {
  title: string;
  description?: string;
  category: string;
  progress: number;
  completed: boolean;
  date: string;
  onClick?: () => void;
}

function ProgressCube({ 
  title, 
  progress, 
  completed, 
  category, 
  onClick 
}: Omit<ProgressEntry3DProps, 'description' | 'date'>) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y += hovered ? 0.02 : 0.005;
      meshRef.current.scale.setScalar(hovered ? 1.1 : 1);
    }
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      study: '#3b82f6', // blue
      exercise: '#10b981', // green
      health: '#f59e0b', // amber
      sleep: '#8b5cf6', // violet
      default: '#6b7280' // gray
    };
    return colors[category.toLowerCase() as keyof typeof colors] || colors.default;
  };

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 200);
    onClick?.();
  };

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      <RoundedBox
        ref={meshRef}
        args={[2, 2, 2]}
        radius={0.1}
        smoothness={4}
        scale={clicked ? 0.9 : 1}
      >
        <meshStandardMaterial 
          color={getCategoryColor(category)}
          transparent
          opacity={completed ? 1 : 0.7}
          emissive={getCategoryColor(category)}
          emissiveIntensity={hovered ? 0.2 : 0.1}
        />
      </RoundedBox>

      {/* Progress ring */}
      <mesh position={[0, 0, 1.1]} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.8, 1, 32, 1, 0, (progress / 100) * Math.PI * 2]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>

      {/* Title text */}
      <Text
        position={[0, 0.3, 1.1]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
        textAlign="center"
        font="/fonts/Inter-Bold.woff"
      >
        {title}
      </Text>

      {/* Progress percentage */}
      <Text
        position={[0, -0.3, 1.1]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {progress}%
      </Text>

      {completed && (
        <Text
          position={[0, -0.7, 1.1]}
          fontSize={0.2}
          color="#10b981"
          anchorX="center"
          anchorY="middle"
        >
          ✓ Complete
        </Text>
      )}
    </group>
  );
}

export function ProgressEntry3D(props: ProgressEntry3DProps) {
  return (
    <motion.article 
      className="hatom progress-entry-3d h-64 w-full rounded-lg overflow-hidden"
      itemScope
      itemType="https://schema.org/CreativeWork"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      data-category={props.category}
      data-progress={props.progress}
      data-date={props.date}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        
        <ProgressCube {...props} />
        
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          autoRotate={false}
          enableDamping
          dampingFactor={0.1}
        />
      </Canvas>
      
      {/* Hidden structured data for hAtom */}
      <div className="sr-only" itemProp="name">{props.title}</div>
      <div className="sr-only" itemProp="description">{props.description}</div>
      <div className="sr-only" itemProp="dateCreated">{props.date}</div>
      <div className="sr-only" itemProp="about">{props.category}</div>
    </motion.article>
  );
}