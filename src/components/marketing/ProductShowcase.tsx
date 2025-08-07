import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float, Environment, ContactShadows } from "@react-three/drei";
import { motion, useInView } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import * as THREE from "three";

function ProductModel({ modelPath, scale = 1, position = [0, 0, 0] }: {
  modelPath: string;
  scale?: number;
  position?: [number, number, number];
}) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={meshRef} position={position} scale={scale}>
        {/* Placeholder 3D model - in real app, you'd load actual GLTF models */}
        <mesh>
          <boxGeometry args={[2, 3, 0.2]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[1.8, 2.8]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
        {/* Screen content */}
        <mesh position={[0, 0.5, 0.12]}>
          <planeGeometry args={[1.6, 0.8]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
        <mesh position={[0, -0.3, 0.12]}>
          <planeGeometry args={[1.4, 1.2]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
      </group>
    </Float>
  );
}

function InteractiveScene({ activeTab }: { activeTab: string }) {
  const [isRotating, setIsRotating] = useState(true);
  const controlsRef = useRef<any>(null);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative h-96 bg-gradient-to-br from-background to-primary/5 rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Environment preset="studio" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {activeTab === "mobile" && (
          <ProductModel modelPath="/models/phone.gltf" scale={1} position={[0, 0, 0]} />
        )}
        {activeTab === "desktop" && (
          <ProductModel modelPath="/models/laptop.gltf" scale={1.2} position={[0, -0.5, 0]} />
        )}
        {activeTab === "analytics" && (
          <group>
            <ProductModel modelPath="/models/tablet.gltf" scale={0.8} position={[-1, 0, 0]} />
            <ProductModel modelPath="/models/phone.gltf" scale={0.6} position={[1, 0, 0]} />
          </group>
        )}
        
        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />
        
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          autoRotate={isRotating}
          autoRotateSpeed={2}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
      
      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsRotating(!isRotating)}
          className="p-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50 hover:bg-background transition-colors"
        >
          {isRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={resetCamera}
          className="p-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50 hover:bg-background transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}

const products = {
  mobile: {
    title: "Mobile Experience",
    description: "Track your progress on the go with our intuitive mobile app. Native performance with stunning animations.",
    features: ["Offline sync", "Push notifications", "Biometric security", "Dark mode"]
  },
  desktop: {
    title: "Desktop Power",
    description: "Unleash full productivity with our desktop application. Advanced analytics and comprehensive reporting.",
    features: ["Multi-monitor support", "Keyboard shortcuts", "Advanced filtering", "Export capabilities"]
  },
  analytics: {
    title: "Smart Analytics",
    description: "Gain deep insights into your progress with AI-powered analytics and predictive modeling.",
    features: ["Predictive insights", "Custom dashboards", "Team collaboration", "API integration"]
  }
};

export function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState("mobile");

  return (
    <section ref={sectionRef} id="products" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Experience Across
            <span className="bg-gradient-primary bg-clip-text text-transparent block">
              Every Platform
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Seamlessly integrated across all your devices with native performance
            and stunning 3D visualizations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-background/50 backdrop-blur-sm">
              <TabsTrigger value="mobile" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
                Mobile
              </TabsTrigger>
              <TabsTrigger value="desktop" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
                Desktop
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
                Analytics
              </TabsTrigger>
            </TabsList>

            {Object.entries(products).map(([key, product]) => (
              <TabsContent key={key} value={key} className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* 3D Showcase */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={activeTab === key ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    <InteractiveScene activeTab={activeTab} />
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={activeTab === key ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-6"
                  >
                    <h3 className="text-3xl md:text-4xl font-bold">
                      {product.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                    
                    <div className="space-y-3">
                      {product.features.map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: 20 }}
                          animate={activeTab === key ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 bg-gradient-primary rounded-full" />
                          <span className="text-foreground">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={activeTab === key ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <Button className="bg-gradient-primary hover:opacity-90 shadow-glow">
                        Try {product.title}
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}