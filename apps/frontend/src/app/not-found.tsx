"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  HomeIcon, 
  ArrowLeftIcon, 
  ExclamationTriangleIcon,
  ChevronRightIcon,
  SparklesIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(147,51,234,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.1),transparent_70%)]" />
      
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 404 Number */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="text-8xl md:text-9xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-green-400">
              404
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-yellow-400">
            <ExclamationTriangleIcon className="w-8 h-8" />
            <span className="text-xl font-semibold">Page Not Found</span>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          className="mb-12 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Oops! This page seems to be{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              off the yield curve
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Don't worry though - there are plenty of profitable opportunities waiting for you!
          </p>
        </motion.div>

        {/* Interactive Elements */}
        <motion.div
          className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* Suggestion Cards */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-blue-400/30 transition-all duration-300 cursor-pointer group"
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={handleGoToStrategies}
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
              <ChartBarIcon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Explore Strategies</h3>
            <p className="text-gray-400 text-sm">Discover high-yield farming opportunities</p>
          </motion.div>

          <motion.div
            className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-purple-400/30 transition-all duration-300 cursor-pointer group"
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={handleGoToPortfolio}
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
              <CurrencyDollarIcon className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Your Portfolio</h3>
            <p className="text-gray-400 text-sm">Manage your active positions</p>
          </motion.div>

          <motion.div
            className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-green-400/30 transition-all duration-300 cursor-pointer group"
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={handleGoHome}
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors">
              <SparklesIcon className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Get Started</h3>
            <p className="text-gray-400 text-sm">Start your yield farming journey</p>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HomeIcon className="w-5 h-5" />
            Go to Homepage
          </motion.button>

          <motion.button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-8 py-3 bg-gray-800/50 border border-gray-700/50 text-gray-300 font-semibold rounded-lg hover:bg-gray-700/50 hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Go Back
          </motion.button>
        </motion.div>

        {/* Search Suggestion */}
        <motion.div
          className="mt-12 p-4 bg-gray-800/30 border border-gray-700/50 rounded-xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
            <MagnifyingGlassIcon className="w-5 h-5" />
            <span className="text-sm">Looking for something specific?</span>
          </div>
          <p className="text-gray-500 text-sm">
            Try searching for strategies, tokens, or check our documentation for more information.
          </p>
        </motion.div>
      </motion.div>

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-blue-500/30 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-purple-500/30 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-green-500/30 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-yellow-500/30 rounded-br-lg" />
    </div>
  );
}
