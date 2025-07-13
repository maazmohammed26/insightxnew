import { motion } from 'framer-motion';
import { Trophy, Award, Star } from 'lucide-react';

interface CircularScoreProps {
  score: number;
}

const CircularScore = ({ score }: CircularScoreProps) => {
  const getScoreIcon = () => {
    if (score >= 90) return <Trophy className="w-12 h-12 text-yellow-300" />;
    if (score >= 70) return <Award className="w-12 h-12 text-blue-300" />;
    return <Star className="w-12 h-12 text-purple-300" />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="relative p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 shadow-xl"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="mb-2"
        >
          {getScoreIcon()}
        </motion.div>
        
        <div className="text-center">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <span className="text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
              {score}
            </span>
            <span className="absolute -right-8 top-2 text-4xl font-bold text-blue-200/80">%</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-sm text-blue-100/80"
          >
            Data Quality Score
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      />
    </motion.div>
  );
};

export default CircularScore;