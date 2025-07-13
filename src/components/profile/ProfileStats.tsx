import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Share2, Users } from 'lucide-react';

interface ProfileStatsProps {
  analysisCount: number;
  sharedCount: number;
  friendsCount: number;
}

const ProfileStats = ({ analysisCount, sharedCount, friendsCount }: ProfileStatsProps) => {
  const stats = [
    {
      icon: FileText,
      label: 'Analyses',
      value: analysisCount,
      color: 'text-purple-600'
    },
    {
      icon: Share2,
      label: 'Shared',
      value: sharedCount,
      color: 'text-blue-600'
    },
    {
      icon: Users,
      label: 'Friends',
      value: friendsCount,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-4 my-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 shadow-sm"
          >
            <Icon className={`h-6 w-6 ${stat.color} mb-2`} />
            <span className="text-2xl font-bold text-foreground">{stat.value}</span>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProfileStats;