import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoomVideoEmbed } from './LoomVideoEmbed';
import { getTutorialVideo, TutorialVideoId } from '@/config/tutorialVideos';

interface TutorialVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: TutorialVideoId;
}

export const TutorialVideoModal: React.FC<TutorialVideoModalProps> = ({
  isOpen,
  onClose,
  videoId,
}) => {
  const video = getTutorialVideo(videoId);

  if (!video) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-wedding-olive">
            {video.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <LoomVideoEmbed
            videoId={video.loomId}
            description={video.description}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
