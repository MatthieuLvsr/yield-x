'use client';

import {
  ArrowLeftIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleGoToStrategies = () => {
    router.push('/strategies');
  };

  const handleGoToPortfolio = () => {
    router.push('/portfolio');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(147,51,234,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.1),transparent_70%)]" />

      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        className="absolute top-20 left-20 h-64 w-64 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        className="absolute right-20 bottom-20 h-48 w-48 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 blur-3xl"
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />

      {/* Main Content */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mx-auto max-w-4xl text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        {/* 404 Number */}
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="mb-4 font-black text-8xl md:text-9xl">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              404
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-yellow-400">
            <ExclamationTriangleIcon className="h-8 w-8" />
            <span className="font-semibold text-xl">Page Not Found</span>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h1 className="mb-4 font-bold text-3xl text-white md:text-4xl">
            Oops! This page seems to be{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              off the yield curve
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-gray-300 text-lg leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Don't
            worry though - there are plenty of profitable opportunities waiting
            for you!
          </p>
        </motion.div>

        {/* Interactive Elements */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-12 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* Suggestion Cards */}
          <motion.div
            className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/30"
            onClick={handleGoToStrategies}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 transition-colors group-hover:bg-blue-500/30">
              <ChartBarIcon className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="mb-2 font-semibold text-white">
              Explore Strategies
            </h3>
            <p className="text-gray-400 text-sm">
              Discover high-yield farming opportunities
            </p>
          </motion.div>

          <motion.div
            className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-purple-400/30"
            onClick={handleGoToPortfolio}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 transition-colors group-hover:bg-purple-500/30">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="mb-2 font-semibold text-white">Your Portfolio</h3>
            <p className="text-gray-400 text-sm">
              Manage your active positions
            </p>
          </motion.div>

          <motion.div
            className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-green-400/30"
            onClick={handleGoHome}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20 transition-colors group-hover:bg-green-500/30">
              <SparklesIcon className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="mb-2 font-semibold text-white">Get Started</h3>
            <p className="text-gray-400 text-sm">
              Start your yield farming journey
            </p>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
            onClick={handleGoHome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HomeIcon className="h-5 w-5" />
            Go to Homepage
          </motion.button>

          <motion.button
            className="flex items-center gap-2 rounded-lg border border-gray-700/50 bg-gray-800/50 px-8 py-3 font-semibold text-gray-300 transition-all duration-300 hover:bg-gray-700/50 hover:text-white"
            onClick={handleGoBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Go Back
          </motion.button>
        </motion.div>

        {/* Search Suggestion */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 rounded-xl border border-gray-700/50 bg-gray-800/30 p-4 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="mb-2 flex items-center justify-center gap-2 text-gray-400">
            <MagnifyingGlassIcon className="h-5 w-5" />
            <span className="text-sm">Looking for something specific?</span>
          </div>
          <p className="text-gray-500 text-sm">
            Try searching for strategies, tokens, or check our documentation for
            more information.
          </p>
        </motion.div>
      </motion.div>

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 h-12 w-12 rounded-tl-lg border-blue-500/30 border-t-2 border-l-2" />
      <div className="absolute top-4 right-4 h-12 w-12 rounded-tr-lg border-purple-500/30 border-t-2 border-r-2" />
      <div className="absolute bottom-4 left-4 h-12 w-12 rounded-bl-lg border-green-500/30 border-b-2 border-l-2" />
      <div className="absolute right-4 bottom-4 h-12 w-12 rounded-br-lg border-yellow-500/30 border-r-2 border-b-2" />
    </div>
  );
}
