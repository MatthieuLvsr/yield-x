"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Hash, Volume2 } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/constants';

interface DiscordWidgetProps {
  variant?: 'button' | 'card' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  showMemberCount?: boolean;
  className?: string;
}

const DiscordWidget: React.FC<DiscordWidgetProps> = ({
  variant = 'button',
  size = 'md',
  showMemberCount = false,
  className = ''
}) => {
  const handleJoinDiscord = () => {
    window.open(SOCIAL_LINKS.DISCORD, '_blank', 'noopener,noreferrer');
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  if (variant === 'button') {
    return (
      <motion.button
        onClick={handleJoinDiscord}
        className={`
          flex items-center gap-2 
          bg-[#5865F2]/20 border border-[#5865F2]/30 text-[#5865F2] 
          rounded-lg hover:bg-[#5865F2]/30 
          transition-all duration-200 font-medium
          ${sizeClasses[size]} ${className}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-4 h-4" />
        <span>Join Discord</span>
      </motion.button>
    );
  }

  if (variant === 'card') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`yieldx-card-glass p-6 rounded-xl border border-white/10 ${className}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#5865F2]/20 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-[#5865F2]" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Join Our Community</h3>
            <p className="text-gray-400 text-sm">Connect with other yield farmers</p>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Hash className="w-4 h-4 text-[#5865F2]" />
            <span>Real-time strategy discussions</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Volume2 className="w-4 h-4 text-[#5865F2]" />
            <span>Live yield farming updates</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <MessageCircle className="w-4 h-4 text-[#5865F2]" />
            <span>Community support & tips</span>
          </div>
        </div>
        
        {showMemberCount && (
          <div className="bg-[#5865F2]/10 border border-[#5865F2]/20 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Members Online</span>
              <span className="text-[#5865F2] font-semibold">1,234</span>
            </div>
          </div>
        )}
        
        <motion.button
          onClick={handleJoinDiscord}
          className="w-full yieldx-btn-primary justify-center bg-[#5865F2] hover:bg-[#4752C4] border-[#5865F2]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Join Discord Server
        </motion.button>
      </motion.div>
    );
  }

  // Inline variant
  return (
    <motion.a
      href={SOCIAL_LINKS.DISCORD}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center gap-2 text-[#5865F2] hover:text-[#4752C4] 
        transition-colors duration-200 ${className}
      `}
      whileHover={{ scale: 1.05 }}
    >
      <MessageCircle className="w-4 h-4" />
      <span>Discord</span>
    </motion.a>
  );
};

export default DiscordWidget;
