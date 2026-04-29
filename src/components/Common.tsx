import { motion } from "motion/react";
import { Footprints } from "lucide-react";

export const PawIcon = ({ className = "" }: { className?: string }) => (
  <Footprints className={`text-fur-pink ${className}`} />
);

export const LoadingFuff = () => (
  <div className="flex flex-col items-center justify-center p-20 gap-4">
    <motion.div
      animate={{ 
        scale: [1, 1.2, 1],
        rotate: [0, 10, -10, 0]
      }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <Footprints size={64} className="text-fur-pink" />
    </motion.div>
    <p className="font-display font-bold text-2xl text-fur-pink animate-pulse">Fetching fluffiness...</p>
  </div>
);
