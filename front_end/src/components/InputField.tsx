import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface InputFieldProps {
  id: string;
  label: string;
  value: string | number;
  isTextarea?: boolean;
  onValueChange: (value: string) => void;
  isTBD: boolean;
  onToggleTBDOK: () => void;
  disabled?: boolean;
  toggleDisabled?: boolean;
  type?: 'text' | 'number' | 'tel' | 'email';
}

const InputField: React.FC<InputFieldProps> = ({
  id, label, value, isTextarea, onValueChange, isTBD, onToggleTBDOK,
  disabled = false, toggleDisabled = false, type = 'text'
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="flex items-center space-x-2">
        {isTextarea ? (
          <Textarea
            id={id}
            value={String(value)}
            onChange={(e) => onValueChange(e.target.value)}
            className={`flex-grow ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            rows={3}
            disabled={disabled}
            readOnly={disabled}
          />
        ) : (
          <Input
            id={id}
            type={type}
            value={String(value)}
            onChange={(e) => onValueChange(e.target.value)}
            className={`flex-grow ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            disabled={disabled}
            readOnly={disabled}
          />
        )}
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
export default InputField;