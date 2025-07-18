import { motion } from 'framer-motion';
import type { Stats } from '@/app/page';

interface StrategiesHeaderProps {
  strategiesCount: number;
  stats: Stats;
}

const StrategiesHeader = ({
  strategiesCount,
  stats,
}: StrategiesHeaderProps) => {
  return (
    <div className="mb-12 text-center">
      <motion.h2
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 font-bold text-4xl text-white md:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-white">Earn </span>
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
          Strategies
        </span>
      </motion.h2>

      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mb-8 max-w-3xl text-gray-300 text-xl"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Choose from our curated selection of yield strategies, each optimized
        for different risk profiles and return expectations.
      </motion.p>

      {/* Stats et refresh */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex flex-wrap items-center justify-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="text-center">
          <div className="font-bold text-3xl text-blue-400">
            {strategiesCount}
          </div>
          <div className="text-gray-400 text-sm">Strategies Available</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-3xl text-green-400">{stats.tvl}$</div>
          <div className="text-gray-400 text-sm">Total Value Locked</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-3xl text-purple-400">
            {stats.averageApy}%
          </div>
          <div className="text-gray-400 text-sm">Average APY</div>
        </div>
      </motion.div>
    </div>
  );
};

export default StrategiesHeader;
