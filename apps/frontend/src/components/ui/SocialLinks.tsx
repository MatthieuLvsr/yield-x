'use client';

import type React from 'react';
import DiscordWidget from './DiscordWidget';
import SocialWidget from './SocialWidget';

interface SocialLinksProps {
  variant?: 'button' | 'card' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical' | 'grid';
  platforms?: ('discord' | 'twitter' | 'github' | 'docs' | 'telegram')[];
  className?: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  variant = 'inline',
  size = 'md',
  layout = 'horizontal',
  platforms = ['docs', 'github', 'twitter', 'discord', 'telegram'],
  className = '',
}) => {
  const layoutClasses = {
    horizontal: 'flex flex-wrap gap-4 items-center justify-center',
    vertical: 'flex flex-col gap-4 items-center',
    grid: 'grid grid-cols-2 md:grid-cols-4 gap-8',
  };

  const commonStyles =
    'text-rgb(var(--yieldx-text-tertiary)) hover:scale-105 font-medium transition-all duration-300 py-2';

  const renderPlatform = (platform: string) => {
    if (platform === 'discord') {
      return (
        <div className="flex justify-center" key={platform}>
          <DiscordWidget
            className={`${commonStyles} hover:text-[#5865F2]`}
            size={size}
            variant={variant}
          />
        </div>
      );
    }

    const platformStyles = {
      twitter: 'hover:text-blue-400',
      github: 'hover:text-gray-200',
      docs: 'hover:text-green-400',
      telegram: 'hover:text-blue-500',
    };

    return (
      <div className="flex justify-center" key={platform}>
        <SocialWidget
          className={`${commonStyles} ${platformStyles[platform as keyof typeof platformStyles]}`}
          platform={platform as any}
          size={size}
          variant={variant}
        />
      </div>
    );
  };

  return (
    <div className={`${layoutClasses[layout]} ${className}`}>
      {platforms.map(renderPlatform)}
    </div>
  );
};

export default SocialLinks;
