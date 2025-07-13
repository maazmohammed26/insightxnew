import { motion } from 'framer-motion';

interface WaveAnimationProps {
  score: number;
}

const WaveAnimation = ({ score }: WaveAnimationProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/20 to-transparent backdrop-blur-sm"
        initial={{ height: "0%" }}
        animate={{ height: `${score}%` }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 1
        }}
        style={{
          borderTopLeftRadius: '100%',
          borderTopRightRadius: '100%',
          filter: 'blur(8px)',
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/10 to-transparent"
        initial={{ height: "0%" }}
        animate={{ height: `${score - 5}%` }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.5,
          delay: 0.5
        }}
        style={{
          borderTopLeftRadius: '100%',
          borderTopRightRadius: '100%',
          filter: 'blur(6px)',
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/15 to-transparent"
        initial={{ height: "0%" }}
        animate={{ height: `${score - 10}%` }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.25,
          delay: 1
        }}
        style={{
          borderTopLeftRadius: '100%',
          borderTopRightRadius: '100%',
          filter: 'blur(4px)',
        }}
      />
    </div>
  );
};

export default WaveAnimation;