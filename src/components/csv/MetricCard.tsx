import { motion } from 'framer-motion';
import { Database, CheckCircle2, Fingerprint } from 'lucide-react';

interface MetricCardProps {
  title: string;
  score: number;
  type: 'completeness' | 'consistency' | 'uniqueness';
}

const MetricCard = ({ title, score, type }: MetricCardProps) => {
  const getIcon = () => {
    switch (type) {
      case 'completeness':
        return <Database className="w-5 h-5" />;
      case 'consistency':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'uniqueness':
        return <Fingerprint className="w-5 h-5" />;
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'completeness':
        return 'from-blue-400 to-blue-200';
      case 'consistency':
        return 'from-green-400 to-green-200';
      case 'uniqueness':
        return 'from-purple-400 to-purple-200';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="p-4 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-2">
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ delay: 0.6 }}
          className={`p-2 rounded-full bg-gradient-to-br ${getGradient()} bg-opacity-20`}
        >
          {getIcon()}
        </motion.div>
        <p className="text-base md:text-lg font-semibold">{title}</p>
      </div>
      <p className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
        {score}%
      </p>
      <div className="w-full bg-white/20 h-2 rounded-full mt-2 overflow-hidden">
        <motion.div 
          className={`h-full rounded-full relative bg-gradient-to-r ${getGradient()}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0"
            animate={{
              x: ["0%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MetricCard;