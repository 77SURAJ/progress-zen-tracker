import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text3D, Center } from "@react-three/drei";
import { motion, useInView } from "framer-motion";
import { Brain, Target, BarChart3, Zap, Shield, Smartphone } from "lucide-react";
import * as THREE from "three";

function Feature3D({ icon, position }: { icon: string; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={meshRef} position={position}>
        <mesh>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#3b82f6" transparent opacity={0.8} />
        </mesh>
        <Center>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.2}
            height={0.05}
            position={[0, 0, 0.5]}
          >
            {icon}
            <meshStandardMaterial color="white" />
          </Text3D>
        </Center>
      </group>
    </Float>
  );
}

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Get personalized recommendations and insights powered by advanced machine learning algorithms.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Target,
    title: "Smart Goal Tracking",
    description: "Set and achieve your goals with intelligent tracking and milestone celebrations.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: BarChart3,
    title: "3D Analytics",
    description: "Visualize your progress with stunning 3D charts and interactive data representations.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Zap,
    title: "Real-time Sync",
    description: "Stay updated across all your devices with lightning-fast real-time synchronization.",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Your data is protected with bank-level encryption and advanced security measures.",
    color: "from-red-500 to-rose-500"
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Designed for mobile with a responsive interface that works perfectly on any device.",
    color: "from-indigo-500 to-blue-500"
  }
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} id="features" className="py-24 relative overflow-hidden">
      {/* Background 3D Scene */}
      <div className="absolute inset-0 opacity-20">
        <Canvas camera={{ position: [0, 0, 8] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          
          <Feature3D icon="🧠" position={[-3, 2, 0]} />
          <Feature3D icon="🎯" position={[3, -1, 0]} />
          <Feature3D icon="📊" position={[-2, -2, 0]} />
          <Feature3D icon="⚡" position={[2, 2, 0]} />
        </Canvas>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Powerful Features for
            <span className="bg-gradient-primary bg-clip-text text-transparent block">
              Maximum Productivity
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to transform your daily routine into a success story,
            powered by cutting-edge technology and beautiful design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
              }}
              className="group relative"
            >
              <div className="relative p-8 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-glow transition-all duration-500 transform-gpu">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-primary hover:opacity-90 text-white px-8 py-4 rounded-full font-semibold shadow-glow transition-all duration-300"
          >
            Explore All Features
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}