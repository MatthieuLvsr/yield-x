"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingPageProps {
  title?: string;
  message?: string;
  showProgress?: boolean;
  progress?: number;
  className?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
  title = "Loading",
  message = "Please wait while we prepare your yield farming experience...",
  showProgress = false,
  progress = 0,
  className = ""
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const spinVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative overflow-hidden ${className}`}>
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
        className="relative z-10 max-w-lg mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Loading Animation */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <div className="relative">
            {/* Outer Ring */}
            <motion.div
              className="w-32 h-32 mx-auto rounded-full border-4 border-gray-700/50 relative"
              variants={spinVariants}
              animate="animate"
            >
              <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-transparent border-t-blue-500 border-r-purple-500"></div>
            </motion.div>
            
            {/* Inner Ring */}
            <motion.div
              className="absolute inset-0 w-24 h-24 m-auto rounded-full border-4 border-gray-700/30"
              variants={pulseVariants}
              animate="animate"
            >
              <div className="absolute inset-0 rounded-full border-b-4 border-l-4 border-transparent border-b-green-500 border-l-yellow-500"></div>
            </motion.div>
            
            {/* Center Logo */}
            <motion.div
              className="absolute inset-0 w-16 h-16 m-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
              variants={pulseVariants}
              animate="animate"
            >
              <span className="text-white font-bold text-lg">Y</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          className="mb-8 space-y-4"
          variants={itemVariants}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
            <motion.span
              className="inline-block ml-2"
              animate={{
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ...
            </motion.span>
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            {message}
          </p>
        </motion.div>

        {/* Progress Bar */}
        {showProgress && (
          <motion.div
            className="mb-8"
            variants={itemVariants}
          >
            <div className="w-full bg-gray-800/50 rounded-full h-2 mb-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-sm text-gray-400">{Math.round(progress)}% Complete</p>
          </motion.div>
        )}

        {/* Loading Steps */}
        <motion.div
          className="space-y-2"
          variants={itemVariants}
        >
          {[
            "Connecting to blockchain...",
            "Loading strategies...",
            "Fetching portfolio data...",
            "Preparing interface..."
          ].map((step, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center gap-2 text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.5, duration: 0.3 }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-blue-500"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
              />
              <span>{step}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-10 -right-10 w-16 h-16 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 blur-xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-blue-500/30 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-purple-500/30 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-green-500/30 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-yellow-500/30 rounded-br-lg" />
    </div>
  );
};

export default LoadingPage;
