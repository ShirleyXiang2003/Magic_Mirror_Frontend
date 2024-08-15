'use client';
import React, { useState } from 'react';
import styles from './HomePageComponents.module.css';
import Image from 'next/image';
import api from '../../lib/api';

const Header: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [contextId, setContextId] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      try {
        setUploadStatus('Uploading...');
        const response = await api.uploadFile(selectedFile);
        setUploadStatus('Upload successful!');
        const { context_id } = response;
        setContextId(context_id);
        console.log('Response context_id:', context_id);

      } catch (error) {
        setUploadStatus('Upload failed.');
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleAnalysisClick = async () => {
    if (contextId) {
      try {
        const response = await api.processShortText(contextId);
        setAnalysisResult(response.text);
        console.log('Analysis result:', response.data);
      } catch (error) {
        console.error('Error processing short text:', error);
      }
    } else {
      console.log('No context_id available. Please upload a file first.');
    }
  };

  return (
    <div>
      <h1 className="text-4xl">魔镜魔镜魔镜</h1>
      <div className={styles.sectionContainer}>
        <section className={styles.uploadSection}>
          <div className={styles.uploadCard}>
            <Image src="http://localhost:3002/home.png" alt="Upload Icon" width={64} height={64}/>
            <p style={{marginTop: '-15px', marginLeft: '78px', fontSize: '15px'}}>开始创作</p>
          </div>
        </section>
        <section className={styles.uploadSection}>
          <div className={styles.uploadCard} onClick={() => document.getElementById('fileInput')?.click()}>
            <Image src="http://localhost:3002/home.png" alt="Upload Icon" width={64} height={64}/>
            <p style={{marginTop: '-15px', marginLeft: '78px', fontSize: '15px'}}>上传模版</p>
          </div>
          <input
            type="file"
            id="fileInput"
            accept=".pdf,.txt"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </section>
        <section className={styles.uploadSection}>
          <div className={styles.uploadCard} onClick={handleAnalysisClick}>
            <Image src="http://localhost:3002/home.png" alt="Upload Icon" width={64} height={64}/>
            <p style={{marginTop: '-15px', marginLeft: '78px', fontSize: '11px'}}>设定集分析开始</p>
          </div>
        </section>
      </div>
      {file && <p>已选择文件: {file.name}</p>}
      {uploadStatus && <p>{uploadStatus}</p>}
      {analysisResult && <p>分析结果: {analysisResult}</p>}
    </div>
  );
};

export default Header;
