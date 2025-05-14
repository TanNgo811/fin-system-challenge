import React from 'react';
import { Button } from './ui/button';
import { PlayCircle, FileText } from 'lucide-react';

interface SidebarProps {
  onVideoModalOpen: () => void;
  onTextModalOpen: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onVideoModalOpen, onTextModalOpen }) => {
  return (
    <aside className="w-20 bg-gray-800 p-4 flex flex-col items-center space-y-6">
      <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700" onClick={onVideoModalOpen}>
        <PlayCircle size={28} />
      </Button>
      <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700" onClick={onTextModalOpen}>
        <FileText size={28} />
      </Button>
    </aside>
  );
};
export default Sidebar;