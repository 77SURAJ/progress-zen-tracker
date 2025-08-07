import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnimatedIconProps {
  icon: LucideIcon;
  className?: string;
  animation?: "bounce" | "rotate" | "pulse" | "scale" | "float";
  delay?: number;
}

export function AnimatedIcon({ 
  icon: Icon, 
  className = "", 
  animation = "bounce",
  delay = 0 
}: AnimatedIconProps) {
  const animations = {
    bounce: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }
    },
    rotate: {
      rotate: 360,
      transition: {
        duration: 3,
        repeat: Infinity,
        delay,
        ease: "linear"
      }
    },
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }
    },
    scale: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }
    },
    float: {
      y: [0, -15, 0],
      x: [0, 5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      animate={animations[animation]}
      className={className}
    >
      <Icon />
    </motion.div>
  );
}

// SVG Path Animation Component
interface AnimatedSVGProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSVG({ children, className = "", delay = 0 }: AnimatedSVGProps) {
  return (
    <motion.svg
      className={className}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2, delay, ease: "easeInOut" }}
    >
      {children}
    </motion.svg>
  );
}

// Floating Particles Component
export function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute w-2 h-2 bg-primary/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 10,
          }}
          animate={{
            y: -10,
            x: Math.random() * window.innerWidth,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}