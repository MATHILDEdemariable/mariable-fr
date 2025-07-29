import React from 'react';

interface VideoBackgroundProps {
  youtubeId: string;
  className?: string;
  children?: React.ReactNode;
}

const VideoBackground = ({ youtubeId, className = "", children }: VideoBackgroundProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* YouTube Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`}
          title="Background Video"
          className="w-full h-full object-cover pointer-events-none"
          allow="autoplay; encrypted-media"
          style={{
            border: 'none',
            aspectRatio: '16/9',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />
      
      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};

export default VideoBackground;