
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select items" 
}) => {
  const handleSelect = (option: string) => {
    const newValue = value.includes(option) 
      ? value.filter(item => item !== option)
      : [...value, option];
    onChange(newValue);
  };

  const handleRemove = (option: string) => {
    onChange(value.filter(item => item !== option));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map(option => (
          <Badge 
            key={option} 
            variant="secondary" 
            className="flex items-center"
          >
            {option}
            <Button 
              size="icon" 
              variant="ghost" 
              className="ml-1 h-4 w-4"
              onClick={() => handleRemove(option)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {value.length > 0 
              ? `${value.length} selected` 
              : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" side="bottom" align="start">
          <Command>
            <CommandList>
              <CommandGroup>
                {options.map(option => (
                  <CommandItem 
                    key={option}
                    onSelect={() => handleSelect(option)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="mr-2">
                        {value.includes(option) ? '✓' : ''}
                      </div>
                      {option}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
