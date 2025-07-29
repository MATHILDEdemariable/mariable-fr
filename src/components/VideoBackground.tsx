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
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&disablekb=1&fs=0&hl=fr&start=0&enablejsapi=0`}
          title="Background Video"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[180%] h-[180%] sm:w-[140%] sm:h-[140%] md:w-[120%] md:h-[120%]"
          allow="autoplay; encrypted-media"
          style={{
            border: 'none',
            minWidth: '180%',
            minHeight: '180%',
            objectFit: 'cover',
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