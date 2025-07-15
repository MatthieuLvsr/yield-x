"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Github, BookOpen, MessageCircle } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/constants';

interface SocialWidgetProps {
  platform: 'twitter' | 'github' | 'docs' | 'telegram';
  variant?: 'button' | 'card' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SocialWidget: React.FC<SocialWidgetProps> = ({
  platform,
  variant = 'inline',
  size = 'md',
  className = ''
}) => {
  const configs = {
    twitter: {
      name: 'Twitter',
      url: SOCIAL_LINKS.TWITTER,
      icon: Twitter,
      color: '#1DA1F2',
      hoverColor: '#1A91DA'
    },
    github: {
      name: 'GitHub',
      url: SOCIAL_LINKS.GITHUB,
      icon: Github,
      color: '#f0f6fc',
      hoverColor: '#c9d1d9'
    },
    docs: {
      name: 'Documentation',
      url: SOCIAL_LINKS.DOCS,
      icon: BookOpen,
      color: '#10b981',
      hoverColor: '#059669'
    },
    telegram: {
      name: 'Telegram',
      url: SOCIAL_LINKS.TELEGRAM,
      icon: MessageCircle,
      color: '#0088cc',
      hoverColor: '#006699'
    }
  };

  const config = configs[platform];
  const Icon = config.icon;

  const handleClick = () => {
    window.open(config.url, '_blank', 'noopener,noreferrer');
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  if (variant === 'button') {
    return (
      <motion.button
        onClick={handleClick}
        className={`
          flex items-center gap-2 
          border rounded-lg font-medium
          transition-all duration-200
          ${sizeClasses[size]} ${className}
        `}
        style={{
          backgroundColor: `${config.color}20`,
          borderColor: `${config.color}30`,
          color: config.color
        }}
        whileHover={{ 
          scale: 1.05,
          backgroundColor: `${config.color}30`
        }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="w-4 h-4" />
        <span>{config.name}</span>
      </motion.button>
    );
  }

  if (variant === 'card') {
    const cardContent = {
      twitter: {
        subtitle: 'Stay updated with announcements',
        features: ['Real-time updates', 'Protocol news', 'Community highlights']
      },
      github: {
        subtitle: 'Explore our open-source code',
        features: ['View source code', 'Report issues', 'Contribute to development']
      },
      docs: {
        subtitle: 'Learn how to use Yield-X',
        features: ['Getting started guide', 'API documentation', 'Integration tutorials']
      },
      telegram: {
        subtitle: 'Join our community chat',
        features: ['Live discussions', 'Quick support', 'Community updates']
      }
    };

    const content = cardContent[platform];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`yieldx-card-glass p-6 rounded-xl border border-white/10 ${className}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${config.color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color: config.color }} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{config.name}</h3>
            <p className="text-gray-400 text-sm">{content.subtitle}</p>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          {content.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-300 text-sm">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        
        <motion.button
          onClick={handleClick}
          className="w-full yieldx-btn-primary justify-center"
          style={{
            backgroundColor: config.color,
            borderColor: config.color
          }}
          whileHover={{ 
            scale: 1.02,
            backgroundColor: config.hoverColor
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Icon className="w-4 h-4 mr-2" />
          Open {config.name}
        </motion.button>
      </motion.div>
    );
  }

  // Inline variant
  return (
    <motion.a
      href={config.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center gap-2 transition-colors duration-200 ${className}
      `}
      style={{
        color: config.color
      }}
      whileHover={{ 
        scale: 1.05,
        color: config.hoverColor
      }}
    >
      <Icon className="w-4 h-4" />
      <span>{config.name}</span>
    </motion.a>
  );
};

export default SocialWidget;
