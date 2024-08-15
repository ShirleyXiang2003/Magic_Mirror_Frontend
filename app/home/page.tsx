'use client'
import React from 'react';
import TemplateSelection from '../components/HomePageComponents/TemplateSelection';
import RecentWorks from '../components/HomePageComponents/RecentWorks';
import styles from './home.module.css';
const HomePage: React.FC = () => {
  return (
    <>
      <a href="#" className={styles.btn}>开始创作</a>
      <div className="text-right mt-4">
        <h2 className="text-xl font-semibold mb-4">选择模版</h2>
        <a href="/home/templates" className="text-sm text-blue-500 hover:underline">查看更多</a>
      </div>
      
      {/* <TemplateSelection />
      <h2 className="text-xl font-semibold mb-4">最近作品</h2>
      <RecentWorks /> */}
    </>
  );
};

export default HomePage;
