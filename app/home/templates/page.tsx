'use client'
import React, { useState } from 'react';
import TemplateSelection from "@/app/components/HomePageComponents/TemplateSelection";
import SortButton from '@/app/components/HomePageComponents/SortButton';
import SearchBar from '@/app/components/HomePageComponents/SearchBar';

const TemplatesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'lastUpdated' | 'wordCount'>('lastUpdated');

  return (
    <>
      <TemplateSelection searchTerm={searchTerm} sortBy={sortBy} />
    </>
  )
};

export default TemplatesPage;
