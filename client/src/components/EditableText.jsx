import React, { useState, useEffect, useRef } from 'react';
import { Pencil } from 'lucide-react';

const EditableText = ({ value, onChange, className, as: Component = 'div', placeholder = 'Enter text...' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Move cursor to end
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && Component !== 'textarea') {
      handleBlur();
    }
  };

  if (isEditing) {
    if (Component === 'textarea') {
      return (
        <textarea
          ref={inputRef}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          className={`bg-white/20 border border-blue-400 outline-none w-full p-1 rounded resize-none ${className}`}
          rows={3}
        />
      );
    }
    return (
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`bg-white/20 border border-blue-400 outline-none w-full p-1 rounded ${className}`}
      />
    );
  }

  return (
    <Component 
      className={`group relative cursor-pointer hover:ring-2 hover:ring-blue-400 hover:ring-opacity-50 rounded px-1 transition-all ${className}`} 
      onClick={() => setIsEditing(true)}
    >
      {value || <span className="opacity-50 italic">{placeholder}</span>}
      <Pencil size={12} className="absolute -right-4 top-1 opacity-0 group-hover:opacity-100 text-blue-500" />
    </Component>
  );
};

export default EditableText;
