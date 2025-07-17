import { motion } from 'framer-motion';
import YieldCard from '@/components/ui/YieldCard';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success';
  index?: number;
}

const StatCard = ({
  title,
  value,
  subtitle,
  trend = 'neutral',
  trendValue,
  variant = 'primary',
  index = 0,
}: StatCardProps) => {
  const gradientClasses = {
    primary: 'yield-primary-gradient',
    secondary: 'yield-secondary-gradient',
    accent: 'yield-accent-gradient',
    success: 'yield-success-gradient',
  };

  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400',
  };

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→',
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <YieldCard className="p-6 text-center" variant="stats">
        <div className="space-y-2">
          <h3 className="font-medium text-sm text-white/60 uppercase tracking-wider">
            {title}
          </h3>
          <div
            className={`font-bold text-3xl ${gradientClasses[variant]} bg-clip-text`}
          >
            {value}
          </div>
          {subtitle && <p className="text-sm text-white/50">{subtitle}</p>}
          {trendValue && (
            <div
              className={`flex items-center justify-center space-x-1 text-sm ${trendColors[trend]}`}
            >
              <span>{trendIcons[trend]}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </YieldCard>
    </motion.div>
  );
};

interface YieldStatsProps {
  stats: Array<{
    title: string;
    value: string;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    variant?: 'primary' | 'secondary' | 'accent' | 'success';
  }>;
  className?: string;
}

const YieldStats = ({ stats, className = '' }: YieldStatsProps) => {
  return (
    <div
      className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ${className}`}
    >
      {stats.map((stat, index) => (
        <StatCard key={stat.title} {...stat} index={index} />
      ))}
    </div>
  );
};

export default YieldStats;
