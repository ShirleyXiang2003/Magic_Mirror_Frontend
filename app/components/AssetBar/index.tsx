'use client';
import React, { useState, useEffect } from 'react';
import { BsImages, BsReverseLayoutTextSidebarReverse, BsBoxArrowInUpLeft, BsArrowRepeat, BsStars } from 'react-icons/bs';
import styles from './AssetBar.module.css';
import api from '../../lib/api';

interface AssetsBarProps {
  prevText: string;
  nextText: string; 
}

export default function AssetsBar({ prevText, nextText }: AssetsBarProps) {
  const BASE_URL = "http://10.144.51.20:3000";
  const [selectedSection, setSelectedSection] = useState(0); 
  const [selectedTab, setSelectedTab] = useState(0);
  const [assets, setAssets] = useState<any[]>([]);
  const [isImageSelected, setIsImageSelected] = useState(false); 
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null); 
  const [displayedTextForPic, setDisplayedTextForPic] = useState('');   // Display Text for Picture
  const [textQueueForPic, setTextQueueForPic] = useState<any[]>([]);
  const [isTextSelected, setIsTextSelected] = useState(false); 
  const [displayedTextForText, setDisplayedTextForText] = useState('');
  const [textQueueForText, setTextQueueForText] = useState<any[]>([]);
  const [isRotating, setIsRotating] = useState(false);
  const [lastText, setLastText] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null); 
  const [selectedTagForText, setSelectedTagForText] = useState<string | null>(null); 

  async function fetchImageAsFile(imageUrl: string, fileName: string) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  }

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.getAllResources();
        if (response.data) {
          setAssets(response.data.map((res: any) => {
            if (res.image_id) {
              const id_splitted = res.image_id.split('.');
              res.image_id = `${id_splitted[0]}.compressed.${id_splitted[1]}`;
            }
            return res;
          }));
        } else {
          console.log('No data returned from getAllResources');
        }
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      }
    };

    fetchAssets();
  }, []);

  const handleSectionClick = (section: any) => {
    setSelectedSection(section);
    setIsImageSelected(false);
    setSelectedImageUrl(null); 
  };

  const handleImageClick = async (imageUrl: string, imageTag: string) => {
    setIsImageSelected(true);
    setSelectedImageUrl(imageUrl);
    setSelectedTag(imageTag);
    await handlePicture(imageUrl, imageTag);
  };

  const handleTextClick = async (text: string, textTag: string) => {
    setIsTextSelected(true);
    setSelectedTagForText(textTag);
    setLastText(text);
    await handleText(text, textTag);
  };

  const handleTabClick = (index: number) => {
    setSelectedTab(index);
  };

  const filterAssets = (type: any) => {
    const tags = ['全部', '环境', '动作', '语言', '神态', '外貌', '心理'];
    const selectedTag = tags[selectedTab];
    if (selectedTag === '全部') {
      return assets.filter(asset => (type === 'image' && asset.image_id) || (type === 'text' && asset.text));
    }
    return assets.filter(asset => asset.tag === selectedTag && ((type === 'image' && asset.image_id) || (type === 'text' && asset.text)));
  };

  const tabs = ['全部', '环境', '动作', '语言', '神态', '外貌', '心理'];

  // Handle Image-to-Text Generation

  const handlePicture = async (imageUrl: string, tag: string) => {
    const file = await fetchImageAsFile(imageUrl, "test-image.jpg");

    // Clear previous text and queue
    setDisplayedTextForPic('');
    setTextQueueForPic([]);

    const handleMessage = (message: any) => {
      if (message && message.description) {
        setTextQueueForPic(prevQueue => [...prevQueue, message.description]);
      }
    };

    const handleError = (err: any) => {
      console.log(`Error: ${err}`);
    };

    const handleDone = () => {
      console.log('Finished');
    }

    await api.generateDescriptionStream(
      file,
      prevText,
      nextText,
      tag,
      '',
      handleMessage,
      handleError,
      handleDone
    );
  };

  useEffect(() => {
    if (textQueueForPic.length > 0) {
      const timer = setInterval(() => {
        setDisplayedTextForPic(prevText => prevText + textQueueForPic[0]);
        setTextQueueForPic(prevQueue => prevQueue.slice(1));
      }, 20); 

      return () => clearInterval(timer);
    }
  }, [textQueueForPic]);

  const handleRegeneratePic = () => {
    if (selectedImageUrl && selectedTag) {
      handlePicture(selectedImageUrl, selectedTag);
    }
    setIsRotating(true); 
    setTimeout(() => setIsRotating(false), 1000); 
  };
  const handleRegenerateText = () => {
    if (lastText && selectedTagForText) {
      handleText(lastText, selectedTagForText);
    }
    setIsRotating(true); 
    setTimeout(() => setIsRotating(false), 1000); 
  };

  // Handle Text-to-Text Generation
  const handleText = async (text: string, tag: string) => {
    console.log(tag);

    // Clear previous text and queue
    setDisplayedTextForText('');
    setTextQueueForText([]);

    const handleMessage = (message: any) => {
      if (message && message.polished_text) {
        setTextQueueForText(prevQueue => [...prevQueue, message.polished_text]);
      }
    };

    const handleError = (err: any) => {
      console.log(`Error: ${err}`);
    };

    const handleDone = () => {
      console.log('Finished');
    }

    await api.polishTextStream(
      text,
      prevText,
      nextText,
      tag,
      '天真开朗',
      handleMessage,
      handleError,
      handleDone
    );
  };

  useEffect(() => {
    if (textQueueForText.length > 0) {
      const timer = setInterval(() => {
        setDisplayedTextForText(prevText => prevText + textQueueForText[0]);
        setTextQueueForText(prevQueue => prevQueue.slice(1));
      }, 60); 

      return () => clearInterval(timer);
    }
  }, [textQueueForText]);


  return (
    <div className="w-full">
      {isImageSelected ? (
        <div className={styles.scrollSecondary}>
          <div key={selectedTag} className={styles.imageContainer} style={{marginBottom: '-20px', marginTop: '40px'}}>
            <div className={styles.cardLabelPic}>{selectedTag}</div> 
            <img 
              src={selectedImageUrl || ""}
              alt="Selected"
              className={styles.image} 
            />
          </div>
          <div className={styles.selectedImageBlock}>
            {/* <img src={selectedImageUrl || ""} alt="Selected" className={styles.selectedImage} /> */}
            <div className={styles.resultHeading}>
              <BsStars></BsStars>
              <p>生成结果</p>
            </div>
            <div className={styles.textContainer}>
              <p>{displayedTextForPic}</p>
            </div>
            <div className={styles.actionButtonContainer}>
              <button className={styles.actionButton}>
                <BsBoxArrowInUpLeft />
                插入文中
              </button>
              <button 
                className={`${styles.actionButton}`} 
                onClick={() => {
                  setDisplayedTextForPic(''); 
                  setTextQueueForPic([]);     
                  handleRegeneratePic();       
                }}
              >
                <BsArrowRepeat className={`${isRotating ? styles.rotate : ''}`} />
                重新生成
              </button>
            </div>
          </div>
        </div>
      ) : isTextSelected ? (
        <div className={styles.scrollSecondary}>
          <div key={selectedTag} className={styles.imageContainer} style={{marginBottom: '-20px', marginTop: '40px'}}>
            <div 
              key={selectedTagForText}
              className={styles.card}
            >
              <div className={styles.cardLabelText}>{selectedTagForText}</div>
              {lastText}
            </div>
          </div>
          <div className={styles.selectedImageBlock}>
            <div className={styles.resultHeading}>
                <BsStars></BsStars>
                <p>生成结果</p>
            </div>
            <div className={styles.textContainer}>
              <p>{displayedTextForText}</p>
            </div>
            <div className={styles.actionButtonContainer}>
                <button className={styles.actionButton}>
                  <BsBoxArrowInUpLeft />
                  插入文中
                </button>
                <button 
                  className={`${styles.actionButton}`} 
                  onClick={() => {
                    setDisplayedTextForText(''); 
                    setTextQueueForText([]);     
                    handleRegenerateText();       
                  }}
                >
                  <BsArrowRepeat className={`${isRotating ? styles.rotate : ''}`} />
                  重新生成
                </button>
              </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-row w-full justify-evenly mb-4">
            <div 
              className={`flex flex-row items-center flex-1 justify-center px-8 py-4 cursor-pointer space-x-2 ${selectedSection === 0 ? "border-b-2 border-[#126FD6]" : ''} hover:border-b-2 hover:border-[#126FD6]`} 
              onClick={() => handleSectionClick(0)}
            >
              {/* <BsImages className="text-base" /> */}
              <span className="text-sm">图片</span>
            </div>
            <div 
              className={`flex flex-row items-center flex-1 justify-center px-8 py-4 cursor-pointer space-x-2 ${selectedSection === 1 ? "border-b-2 border-[#126FD6]" : ''} hover:border-b-2 hover:border-[#126FD6]`} 
              onClick={() => handleSectionClick(1)}
            >
              {/* <BsReverseLayoutTextSidebarReverse className="text-base" /> */}
              <span className="text-sm">文字</span>
            </div>
          </div>
          <div className="w-full mb-4">
            <div className="flex flex-wrap gap-2 justify-start">
              {tabs.map((text, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 text-center rounded-full text-xs cursor-pointer outline-none border-2 border-[#E4EDFC] box-content bg-[#E4EDFC] ${selectedTab === index ? "bg-[#126FD6] text-white" : ""}`}
                  onClick={() => handleTabClick(index)}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
          {selectedSection === 0 && (
            <div className={styles.scrollPrimary}>
              <div className={styles.imageContainer}>
                {filterAssets('image').map(asset => (
                  <div key={asset.id} className={styles.imageContainer}>
                    <div className={styles.cardLabelPic}>{asset.tag}</div> 
                    <img 
                      src={`${BASE_URL}/storage/images/${asset.image_id}`}
                      alt={asset.tag}
                      className={styles.image}
                      onClick={() => handleImageClick(`${BASE_URL}/storage/images/${asset.image_id}`, asset.tag)} 
                    />
                  </div>
                ))}  
                <div/>
              </div>
            </div>
          )}
          {selectedSection === 1 && (
            <div className={styles.scrollPrimary}>
              <div className={styles.cardContainer}>
                {filterAssets('text').map(asset => (
                  <div 
                    key={asset.id} 
                    className={styles.card}
                    onClick={() => handleTextClick(asset.text, asset.tag)} 
                  >
                    <div className={styles.cardLabelText}>{asset.tag}</div>
                    {asset.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
