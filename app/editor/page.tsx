"use client";

import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import Link from "next/link";
// pages/index.js
import React, { useState } from "react";
import { BsHouseDoorFill } from "react-icons/bs";
import LexicalEditorWrapper from '../components/LexicalEditor';
import CollapsibleToolbar from '../components/AssetBar';
import QuillEditor from '../components/QuillEditor';

const Header = ({ onClick }: { onClick: any }) => (
  <header className="h-auto px-4 py-2 flex justify-between items-center">
    <div className="flex items-center">
      <Link href="/">
        <BsHouseDoorFill size={45} className="mr-4 border border-2 border-black rounded-md p-2 hover:bg-black hover:text-white hover:border-transparent transition-all duration-200" />
      </Link>
      <div>
        <input
          type="text"
          className="text-md md:text-lg outline-none bg-transparent w-full"
          defaultValue="我的第一本小说"
        />
        <div className="flex flex-col md:flex-row text-gray-400 text-sm mt-1">
          <span className="mr-0 md:mr-4">字数: 733字</span>
          <span>最后保存于: 2024-07-22 13:58:10</span>
        </div>
      </div>
    </div>
    <button
      className="px-6 py-2 border border-black border-2 rounded-md hover:bg-black hover:text-white hover:border-transparent transition-all duration-200"
      onClick={onClick}
    >
      保存
    </button>
  </header>
);

const Sidebar = () => (
  <div className="flex flex-col p-4">
    <h2 className="text-lg mb-4 text-center">小说设定</h2>
    <input
      type="text"
      placeholder="搜索"
      className="w-full py-2 px-4 mb-4 border border-transparent bg-[#EDF0F7] rounded-full focus:outline-none text-sm"
    />
    <div className="flex-1">
      <div>
        <h3 className="text-lg font-semibold mb-2">主要情节</h3>
        <ul className="list-disc pl-5">
          <li>丁仪的境界</li>
          <li>大事件一</li>
          <li>大事件二</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">关键人物</h3>
        <ul className="list-disc pl-5">
          <li>丁仪 - 情报学家</li>
          <li>王林 - 物理学家</li>
        </ul>
      </div>
      {/* Rest of your content */}
      <div>
        <h3 className="text-lg font-semibold mb-2">主要情节</h3>
        <ul className="list-disc pl-5">
          <li>丁仪的境界</li>
          <li>大事件一</li>
          <li>大事件二</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">关键人物</h3>
        <ul className="list-disc pl-5">
          <li>丁仪 - 情报学家</li>
          <li>王林 - 物理学家</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">主要情节</h3>
        <ul className="list-disc pl-5">
          <li>丁仪的境界</li>
          <li>大事件一</li>
          <li>大事件二</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">关键人物</h3>
        <ul className="list-disc pl-5">
          <li>丁仪 - 情报学家</li>
          <li>王林 - 物理学家</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">主要情节</h3>
        <ul className="list-disc pl-5">
          <li>丁仪的境界</li>
          <li>大事件一</li>
          <li>大事件二</li>
        </ul>
      </div>
    </div>
  </div>
);

const Page = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <Header onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} />
      <main className="flex flex-col md:flex-row flex-1 border-t-4 overflow-hidden">
        {!isSidebarCollapsed && (
          <aside className="w-full md:w-[320px] border-r-4 h-full overflow-y-auto">
            <Sidebar />
          </aside>
        )}
        <div className="flex-1 w-full min-h-full overflow-y-auto">
          <QuillEditor />
        </div>
        <aside className="w-full md:w-[320px] p-4 border-l-4 h-full overflow-y-auto">
          <CollapsibleToolbar />
        </aside>
      </main>
    </div>
  );
};

export default Page;
