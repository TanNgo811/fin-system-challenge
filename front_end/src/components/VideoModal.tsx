import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import video from '../assets/placeholder-video.mp4';

interface ModalProps { isOpen: boolean; onClose: () => void; }

const VideoModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Informational Video</DialogTitle>
          <DialogDescription>
            Watch this short video for more context on the simulation.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <video width="100%" controls autoPlay muted loop>
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default VideoModal;