import React, { useState, useEffect } from 'react';
import SortButton from './SortButton';
import SearchBar from './SearchBar';
import api from '../../lib/api';
import { BsStar, BsStarFill, BsTrash } from 'react-icons/bs';

interface Novel {
  novelId: string;
  title: string;
  wordCount: number;
  collected: boolean;
  updatedAt: string;
}

const RecentWorks: React.FC = () => {
  const [sortBy, setSortBy] = useState<'lastUpdated' | 'wordCount'>('lastUpdated');
  const [searchTerm, setSearchTerm] = useState('');
  const [novels, setNovels] = useState<Novel[]>([]);
  const [selectedNovel, setSelectedNovel] = useState<Novel>();

  const fetchNovels = async () => {
    try {
      const response = await api.getAllNovels();
      setNovels(response.data);
    } catch (error) {
      console.error('Failed to fetch novels:', error);
    }
  };

  const fetchProject = async (novelId : string) => {
    try {
      const response = await api.getProject(novelId);
      setSelectedNovel(response.data);
    } catch (error) {
      console.error('Failed to fetch given novel:', error);
    }
  };

  useEffect(() => {
    fetchNovels();
  }, []);
  const handleStarClick = async (novelId: string) => {
    try {
      setNovels(prevNovels => {
        const updatedNovels = prevNovels.map(novel =>
          novel.novelId === novelId
            ? { ...novel, collected: !novel.collected }
            : novel
        );
        return updatedNovels;
      });
    } catch (error) {
      console.error('Failed to update collect status:', error);
    }
  };

  // 删除小说并刷新列表
  const handleDeleteNovel = async (novelId: string) => {
    try {
      const result = await api.deleteNovel(novelId);
      if (result.success) {
        console.log('Novel deleted successfully');
        fetchNovels(); // 删除成功后重新获取小说列表
      } else {
        console.error('Failed to delete the novel');
      }
    } catch (error) {
      console.error('Error deleting novel:', error);
    }
  };

  // 过滤和排序小说列表
  const filteredWorks = novels.filter(novel =>
    novel.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedWorks = [...filteredWorks].sort((a, b) => {
    if (sortBy === 'lastUpdated') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else {
      return b.wordCount - a.wordCount;
    }
  });

  return (
    <section>
      <div className="flex justify-between items-center">
        <SortButton onSortChange={setSortBy} />
        <SearchBar onSearch={setSearchTerm} />
      </div>

      <div className="mt-10">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                作品名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                字数统计
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                编辑时间
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedWorks.map(novel => (
              <tr key={novel.novelId}>
                <td className="px-6 py-4 whitespace-nowrap">{novel.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-[#CBD2E0]">{novel.wordCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-[#CBD2E0]">{novel.updatedAt}</td>
                <td className="py-4 whitespace-nowrap text-right font-medium flex items-center">
                  {novel.collected ? (
                    <BsStarFill
                      style={{ color: '#717D96', cursor: 'pointer' }}
                      onClick={() => handleStarClick(novel.novelId)}
                    />
                  ) : (
                    <BsStar
                      style={{ color: '#717D96', cursor: 'pointer' }}
                      onClick={() => handleStarClick(novel.novelId)}
                    />
                  )}
                  <BsTrash 
                    style={{ marginLeft: '50px', cursor: 'pointer', color: '#717D96' }} 
                    onClick={() => handleDeleteNovel(novel.novelId)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentWorks;
