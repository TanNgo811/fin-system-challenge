import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from './ui/button';

interface ModalProps { isOpen: boolean; onClose: () => void; }

const TextModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
     const textContent = `
        This simulation is designed to help you understand the impact of various factors on the valuation of a company.
  `.substring(0, 500);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Additional Information</DialogTitle>
        </DialogHeader>
        <div className="py-4 prose prose-sm max-w-none">
          <p>{textContent}</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default TextModal;