"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { BsHouseDoorFill, BsTextIndentLeft, BsTextIndentRight } from "react-icons/bs";
import AssetsBar from '../components/AssetBar';
import QuillEditor from '../components/QuillEditor';
import CollapsibleOutlineBar from "../components/CollapsibleOutlineBar";

const Header = ({ onClick, lastSaved, title, onTitleChange }: { onClick: any, lastSaved: string, title: string, onTitleChange: any }) => (
  <header className="h-auto px-4 py-5 flex ml-10 justify-between items-center">
    <div className="flex items-center">
      <Link href="/home/templates">
        <BsHouseDoorFill size={45} style={{ color: '#126FD6' }} className="mr-4 border border-2 hover:border-[#126FD6] rounded-md p-2 bg-[#E4EDFC] hover:text-white hover:border-transparent transition-all duration-200" />
      </Link>
      <div>
        <input
          type="text"
          className="text-md md:text-lg outline-none bg-transparent w-full"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <div className="flex flex-col md:flex-row text-gray-400 text-sm mt-1">
          <span className="mr-0 md:mr-4">字数: 733字</span>
          <span>最后保存于: {lastSaved}</span>
        </div>
      </div>
    </div>
    <button
      className="px-6 py-2 border border-[#126FD6] border-2 mr-10 rounded-md text-[#126FD6] hover:bg-[#126FD6] hover:text-white hover:border-transparent transition-all duration-200"
      onClick={onClick}
    >
      保存文稿
    </button>
  </header>
);

const Page = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("未保存");
  const [title, setTitle] = useState<string>("");
  const [prevText, setPrevText] = useState<string>('');
  const [nextText, setNextText] = useState<string>('');

  useEffect(() => {
    // 从本地存储中加载标题和最后保存时间
    const savedTitle = localStorage.getItem('title');
    const savedLastSaved = localStorage.getItem('lastSaved');

    if (savedTitle) {
      setTitle(savedTitle);
    }
    if (savedLastSaved) {
      setLastSaved(savedLastSaved);
    }
  }, []);

  useEffect(() => {
    // 每次标题更新时，将标题保存到本地存储
    localStorage.setItem('title', title);
  }, [title]);

  const handleSave = () => {
    const now = new Date();
    const formattedDate = now.toLocaleString(); // 格式化当前时间
    setLastSaved(formattedDate); // 更新最后保存时间
    localStorage.setItem('lastSaved', formattedDate);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleTextUpdate = (prev: string, next: string) => {
    setPrevText(prev);
    setNextText(next);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header 
        onClick={handleSave} 
        lastSaved={lastSaved} 
        title={title} 
        onTitleChange={handleTitleChange} 
      />
      <main className="flex flex-col md:flex-row flex-1 border-t-2 overflow-hidden">
        {!isSidebarCollapsed && (
          <aside className="w-full md:w-[320px] h-full overflow-auto">
            <CollapsibleOutlineBar />
          </aside>
        )}
        
        <div className="relative flex-1 w-full min-h-full">
          <button 
            className={`absolute top-1/2 left-0 transform -translate-y-1/2 w-12 h-12 bg-[#126FD6] text-white border-none p-3 flex justify-center items-center rounded-l-none rounded-r-3xl`}
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            style={{ zIndex: 10 }}
          >
            {isSidebarCollapsed ? <BsTextIndentLeft className="w-6 h-6" /> : <BsTextIndentRight className="w-6 h-6" />}
          </button>
          <QuillEditor onTextUpdate={handleTextUpdate} />
        </div>
        <div className="w-full md:w-[320px] p-4 h-full bg-[#F4F6FC]">
          <AssetsBar prevText={prevText} nextText={nextText} />
        </div>
      </main>
    </div>
  );
};

export default Page;
