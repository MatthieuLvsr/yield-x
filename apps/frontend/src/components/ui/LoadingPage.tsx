'use client';

import { motion } from 'framer-motion';
import type React from 'react';

interface LoadingPageProps {
  title?: string;
  message?: string;
  showProgress?: boolean;
  progress?: number;
  className?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
  title = 'Loading',
  message = 'Please wait while we prepare your yield farming experience...',
  showProgress = false,
  progress = 0,
  className = '',
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const spinVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'linear',
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div
      className={`relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 ${className}`}
    >
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
        animate="visible"
        className="relative z-10 mx-auto max-w-lg text-center"
        initial="hidden"
        variants={containerVariants}
      >
        {/* Loading Animation */}
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="relative">
            {/* Outer Ring */}
            <motion.div
              animate="animate"
              className="relative mx-auto h-32 w-32 rounded-full border-4 border-gray-700/50"
              variants={spinVariants}
            >
              <div className="absolute inset-0 rounded-full border-transparent border-t-4 border-t-blue-500 border-r-4 border-r-purple-500" />
            </motion.div>

            {/* Inner Ring */}
            <motion.div
              animate="animate"
              className="absolute inset-0 m-auto h-24 w-24 rounded-full border-4 border-gray-700/30"
              variants={pulseVariants}
            >
              <div className="absolute inset-0 rounded-full border-transparent border-b-4 border-b-green-500 border-l-4 border-l-yellow-500" />
            </motion.div>

            {/* Center Logo */}
            <motion.div
              animate="animate"
              className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
              variants={pulseVariants}
            >
              <span className="font-bold text-lg text-white">Y</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.div className="mb-8 space-y-4" variants={itemVariants}>
          <h1 className="mb-4 font-bold text-3xl text-white md:text-4xl">
            {title}
            <motion.span
              animate={{
                opacity: [0, 1, 0],
              }}
              className="ml-2 inline-block"
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            >
              ...
            </motion.span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">{message}</p>
        </motion.div>

        {/* Progress Bar */}
        {showProgress && (
          <motion.div className="mb-8" variants={itemVariants}>
            <div className="mb-2 h-2 w-full rounded-full bg-gray-800/50">
              <motion.div
                animate={{ width: `${Math.min(progress, 100)}%` }}
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                initial={{ width: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <p className="text-gray-400 text-sm">
              {Math.round(progress)}% Complete
            </p>
          </motion.div>
        )}

        {/* Loading Steps */}
        <motion.div className="space-y-2" variants={itemVariants}>
          {[
            'Connecting to blockchain...',
            'Loading strategies...',
            'Fetching portfolio data...',
            'Preparing interface...',
          ].map((step, index) => (
            <motion.div
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 text-gray-400 text-sm"
              initial={{ opacity: 0 }}
              key={index}
              transition={{ delay: index * 0.5, duration: 0.3 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                className="h-2 w-2 rounded-full bg-blue-500"
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 0.2,
                  ease: 'easeInOut',
                }}
              />
              <span>{step}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          className="-top-10 -left-10 absolute h-20 w-20 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            rotate: [360, 180, 0],
          }}
          className="-bottom-10 -right-10 absolute h-16 w-16 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 blur-xl"
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 h-12 w-12 rounded-tl-lg border-blue-500/30 border-t-2 border-l-2" />
      <div className="absolute top-4 right-4 h-12 w-12 rounded-tr-lg border-purple-500/30 border-t-2 border-r-2" />
      <div className="absolute bottom-4 left-4 h-12 w-12 rounded-bl-lg border-green-500/30 border-b-2 border-l-2" />
      <div className="absolute right-4 bottom-4 h-12 w-12 rounded-br-lg border-yellow-500/30 border-r-2 border-b-2" />
    </div>
  );
};

export default LoadingPage;
