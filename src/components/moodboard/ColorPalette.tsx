import React from 'react';
import { MoodboardColor } from '@/hooks/useMoodboard';
import { cn } from '@/lib/utils';

interface ColorPaletteProps {
  colors: MoodboardColor[];
  ambiance?: string;
  variant?: 'default' | 'compact';
}

const ColorPalette: React.FC<ColorPaletteProps> = ({
  colors,
  ambiance,
  variant = 'default',
}) => {
  if (colors.length === 0) return null;

  return (
    <div className={cn("space-y-4", variant === 'compact' && "space-y-2")}>
      {ambiance && variant === 'default' && (
        <p className="text-sm text-gray-600 italic text-center">
          "{ambiance}"
        </p>
      )}
      
      <div className={cn(
        "flex justify-center gap-3",
        variant === 'compact' && "gap-2"
      )}>
        {colors.map((color, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={cn(
                "rounded-none border border-gray-200 shadow-sm",
                variant === 'default' ? "w-14 h-14 md:w-16 md:h-16" : "w-10 h-10"
              )}
              style={{ backgroundColor: color.hex }}
              title={`${color.name} - ${color.hex}`}
            />
            <span className={cn(
              "mt-2 text-center leading-tight",
              variant === 'default' ? "text-xs" : "text-[10px]"
            )}>
              {color.name}
            </span>
            <span className={cn(
              "text-gray-400 font-mono uppercase",
              variant === 'default' ? "text-[10px]" : "text-[8px]"
            )}>
              {color.hex}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
