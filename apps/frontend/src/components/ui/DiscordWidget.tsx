'use client';

import { motion } from 'framer-motion';
import { Hash, MessageCircle, Users, Volume2 } from 'lucide-react';
import type React from 'react';
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
  className = '',
}) => {
  const handleJoinDiscord = () => {
    window.open(SOCIAL_LINKS.DISCORD, '_blank', 'noopener,noreferrer');
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  if (variant === 'button') {
    return (
      <motion.button
        className={`flex items-center gap-2 rounded-lg border border-[#5865F2]/30 bg-[#5865F2]/20 font-medium text-[#5865F2] transition-all duration-200 hover:bg-[#5865F2]/30 ${sizeClasses[size]} ${className} `}
        onClick={handleJoinDiscord}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="h-4 w-4" />
        <span>Join Discord</span>
      </motion.button>
    );
  }

  if (variant === 'card') {
    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={`yieldx-card-glass rounded-xl border border-white/10 p-6 ${className}`}
        initial={{ opacity: 0, y: 20 }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5865F2]/20">
            <Users className="h-6 w-6 text-[#5865F2]" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white">
              Join Our Community
            </h3>
            <p className="text-gray-400 text-sm">
              Connect with other yield farmers
            </p>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Hash className="h-4 w-4 text-[#5865F2]" />
            <span>Real-time strategy discussions</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Volume2 className="h-4 w-4 text-[#5865F2]" />
            <span>Live yield farming updates</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <MessageCircle className="h-4 w-4 text-[#5865F2]" />
            <span>Community support & tips</span>
          </div>
        </div>

        {showMemberCount && (
          <div className="mb-4 rounded-lg border border-[#5865F2]/20 bg-[#5865F2]/10 p-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Members Online</span>
              <span className="font-semibold text-[#5865F2]">1,234</span>
            </div>
          </div>
        )}

        <motion.button
          className="yieldx-btn-primary w-full justify-center border-[#5865F2] bg-[#5865F2] hover:bg-[#4752C4]"
          onClick={handleJoinDiscord}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Join Discord Server
        </motion.button>
      </motion.div>
    );
  }

  // Inline variant
  return (
    <motion.a
      className={`inline-flex items-center gap-2 text-[#5865F2] transition-colors duration-200 hover:text-[#4752C4] ${className} `}
      href={SOCIAL_LINKS.DISCORD}
      rel="noopener noreferrer"
      target="_blank"
      whileHover={{ scale: 1.05 }}
    >
      <MessageCircle className="h-4 w-4" />
      <span>Discord</span>
    </motion.a>
  );
};

export default DiscordWidget;
