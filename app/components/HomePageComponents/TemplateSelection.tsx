import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import SortButton from './SortButton';
import api from '../../lib/api';

interface Template {
  templateId: string;
  title: string;
  summary: string[]; 
}

const TemplateSelection: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.getAllTemplates();
        setTemplates(response.templates);
        console.log(response.templates.title);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.summary.join(' ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateSummary = (summary: string) => {
    return summary.length > 100 ? summary.substring(0, 100) + '...' : summary;
  };

  const combinedSummaries = templates
    .map(template => template.summary.join(' '))
    .join(' ');

  console.log(combinedSummaries); 

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <SearchBar onSearch={setSearchTerm} />
      </div>
      <div className="grid grid-cols-5 gap-4">
        {filteredTemplates.map((template, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{template.title}</h3>
            <p className="text-sm text-gray-600">{truncateSummary(template.summary.join(' '))}</p>
          </div>
        ))}
      </div>
      <div className="text-right mt-4">
        <a href="/home/templates" className="text-sm text-blue-500 hover:underline">查看更多</a>
      </div>
    </section>
  );
};

export default TemplateSelection;
