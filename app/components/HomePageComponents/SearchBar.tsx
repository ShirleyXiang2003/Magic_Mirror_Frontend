import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <aside className="flex justify-end">
      <input 
        type="text" 
        placeholder="🔍 搜索" 
        className="rounded-full py-1 px-2" 
        style={{
          background: 'var(--WF-200, #EDF0F7)', 
          borderRadius: '999px' 
        }}
        value={searchTerm}
        onChange={handleInputChange}
      />
    </aside>
  );
};

export default SearchBar;
