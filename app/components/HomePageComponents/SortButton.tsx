// components/SortButton.tsx
import React, { useState } from 'react';

interface SortButtonProps {
  onSortChange: (sortBy: 'lastUpdated' | 'wordCount') => void;
}

const SortButton: React.FC<SortButtonProps> = ({ onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSort = (criteria: 'lastUpdated' | 'wordCount') => {
    onSortChange(criteria);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="text-sm px-4 py-2 hover:bg-gray-300 rounded"
      >
        排序
      </button>
      {isOpen && (
        <ul className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
          <li
            onClick={() => handleSort('lastUpdated')}
            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
          >
            编辑时间
          </li>
          <li
            onClick={() => handleSort('wordCount')}
            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
          >
            字数
          </li>
        </ul>
      )}
    </div>
  );
};

export default SortButton;
