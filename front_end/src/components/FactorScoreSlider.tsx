import React from 'react';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Button } from './ui/button';

interface FactorScoreSliderProps {
  id: string;
  value: number[];
  onValueChange: (value: number[]) => void;
  isTBD: boolean;
  onToggleTBDOK: () => void;
  disabled?: boolean;
  toggleDisabled?: boolean;
}

const FactorScoreSlider: React.FC<FactorScoreSliderProps> = ({
  id, value, onValueChange, isTBD, onToggleTBDOK,
  disabled = false, toggleDisabled = false
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">Factor Score: {value[0]}</Label>
      <div className="flex items-center space-x-2">
        <Slider
          id={id}
          min={1}
          max={5}
          step={1}
          value={value}
          onValueChange={onValueChange}
          className={`flex-grow ${disabled ? 'opacity-50 [&>span:first-child]:bg-gray-300 [&_[role=slider]]:bg-gray-400 [&_[role=slider]]:cursor-not-allowed' : ''}`}
          disabled={disabled}
        />
         <Button 
            variant={isTBD ? "outline" : "default"} 
            size="sm" 
            onClick={onToggleTBDOK} 
            className={`w-16 ${toggleDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={toggleDisabled}
        >
          {isTBD ? 'TBD' : 'OK'}
        </Button>
      </div>
    </div>
  );
};
export default FactorScoreSlider;