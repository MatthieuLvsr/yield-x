'use client';

import { motion } from 'framer-motion';
import { BookOpen, Github, MessageCircle, Twitter } from 'lucide-react';
import type React from 'react';
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
  className = '',
}) => {
  const configs = {
    twitter: {
      name: 'Twitter',
      url: SOCIAL_LINKS.TWITTER,
      icon: Twitter,
      color: '#1DA1F2',
      hoverColor: '#1A91DA',
    },
    github: {
      name: 'GitHub',
      url: SOCIAL_LINKS.GITHUB,
      icon: Github,
      color: '#f0f6fc',
      hoverColor: '#c9d1d9',
    },
    docs: {
      name: 'Documentation',
      url: SOCIAL_LINKS.DOCS,
      icon: BookOpen,
      color: '#10b981',
      hoverColor: '#059669',
    },
    telegram: {
      name: 'Telegram',
      url: SOCIAL_LINKS.TELEGRAM,
      icon: MessageCircle,
      color: '#0088cc',
      hoverColor: '#006699',
    },
  };

  const config = configs[platform];
  const Icon = config.icon;

  const handleClick = () => {
    window.open(config.url, '_blank', 'noopener,noreferrer');
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  if (variant === 'button') {
    return (
      <motion.button
        className={`flex items-center gap-2 rounded-lg border font-medium transition-all duration-200 ${sizeClasses[size]} ${className} `}
        onClick={handleClick}
        style={{
          backgroundColor: `${config.color}20`,
          borderColor: `${config.color}30`,
          color: config.color,
        }}
        whileHover={{
          scale: 1.05,
          backgroundColor: `${config.color}30`,
        }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="h-4 w-4" />
        <span>{config.name}</span>
      </motion.button>
    );
  }

  if (variant === 'card') {
    const cardContent = {
      twitter: {
        subtitle: 'Stay updated with announcements',
        features: [
          'Real-time updates',
          'Protocol news',
          'Community highlights',
        ],
      },
      github: {
        subtitle: 'Explore our open-source code',
        features: [
          'View source code',
          'Report issues',
          'Contribute to development',
        ],
      },
      docs: {
        subtitle: 'Learn how to use Yield-X',
        features: [
          'Getting started guide',
          'API documentation',
          'Integration tutorials',
        ],
      },
      telegram: {
        subtitle: 'Join our community chat',
        features: ['Live discussions', 'Quick support', 'Community updates'],
      },
    };

    const content = cardContent[platform];

    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={`yieldx-card-glass rounded-xl border border-white/10 p-6 ${className}`}
        initial={{ opacity: 0, y: 20 }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: `${config.color}20` }}
          >
            <Icon className="h-6 w-6" style={{ color: config.color }} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white">{config.name}</h3>
            <p className="text-gray-400 text-sm">{content.subtitle}</p>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          {content.features.map((feature, index) => (
            <div
              className="flex items-center gap-2 text-gray-300 text-sm"
              key={index}
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <motion.button
          className="yieldx-btn-primary w-full justify-center"
          onClick={handleClick}
          style={{
            backgroundColor: config.color,
            borderColor: config.color,
          }}
          whileHover={{
            scale: 1.02,
            backgroundColor: config.hoverColor,
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Icon className="mr-2 h-4 w-4" />
          Open {config.name}
        </motion.button>
      </motion.div>
    );
  }

  // Inline variant
  return (
    <motion.a
      className={`inline-flex items-center gap-2 transition-colors duration-200 ${className} `}
      href={config.url}
      rel="noopener noreferrer"
      style={{
        color: config.color,
      }}
      target="_blank"
      whileHover={{
        scale: 1.05,
        color: config.hoverColor,
      }}
    >
      <Icon className="h-4 w-4" />
      <span>{config.name}</span>
    </motion.a>
  );
};

export default SocialWidget;
