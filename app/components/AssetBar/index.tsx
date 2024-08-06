import React, { useState, useEffect } from 'react';
import { BsImages, BsReverseLayoutTextSidebarReverse, BsBoxArrowInUpLeft, BsArrowRepeat } from 'react-icons/bs';
import styles from './AssetBar.module.css';
import api from '../../lib/api';

export default function CollapsibleToolbar() {
  const BASE_URL = "http://10.63.9.158:3000";
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

  const handleImageClick = async (imageUrl: string) => {
    setIsImageSelected(true);
    setSelectedImageUrl(imageUrl);
    await handlePicture(imageUrl);
  };

  const handleTextClick = async (text: string) => {
    setIsTextSelected(true);
    setLastText(text);
    await handleText(text);
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

  const handlePicture = async (imageUrl: string) => {
    const file = await fetchImageAsFile(imageUrl, "test-image.jpg");
    const context = {
      previous: 'previous context',
      next: 'next context',
      tag: '环境'
    };

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
      context.previous,
      context.next,
      context.tag,
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
    if (selectedImageUrl) {
      handlePicture(selectedImageUrl);
    }
    setIsRotating(true); 
    setTimeout(() => setIsRotating(false), 1000); 
  };
  const handleRegenerateText = () => {
    if (lastText) {
      handleText(lastText);
    }
    setIsRotating(true); 
    setTimeout(() => setIsRotating(false), 1000); 
  };

  // Handle Text-to-Text Generation
  const handleText = async (text: string) => {
    const context = {
      previous: '前端要睡觉了',
      next: '移动端还在改bug',
      tag: '心理'
    };

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
      context.previous,
      context.next,
      context.tag,
      '',
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
      <div className="text-lg mb-4 text-center">AI素材卡片</div>
      {isImageSelected ? (
        <div className={styles.selectedImageBlock}>
          <img src={selectedImageUrl || ""} alt="Selected" className={styles.selectedImage} />
          <div className={styles.textContainer}>
            <p>{displayedTextForPic}</p>
            <BsArrowRepeat 
              className={`${styles.regenerateIcon} ${isRotating ? styles.rotate : ''}`} 
              onClick={handleRegeneratePic} 
            />
          </div>
          <button className={styles.actionButton}>
            <BsBoxArrowInUpLeft className={styles.iconButton} />
            插入文中
          </button>
        </div>
      ) : isTextSelected ? (
        <div className={styles.selectedImageBlock}>
          <div className={styles.textContainer}>
            <p>{displayedTextForText}</p>
            <BsArrowRepeat 
              className={`${styles.regenerateIcon} ${isRotating ? styles.rotate : ''}`} 
              onClick={handleRegenerateText}
            />
          </div>
          <button className={styles.actionButton}>
            <BsBoxArrowInUpLeft className={styles.iconButton} />
            插入文中
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-row w-full justify-evenly mb-4">
            <div 
              className={`flex flex-row items-center flex-1 justify-center px-8 py-4 cursor-pointer space-x-2 ${selectedSection === 0 ? "border-b-2 border-black" : ''} hover:border-b-2 hover:border-black`} 
              onClick={() => handleSectionClick(0)}
            >
              <BsImages className="text-base" />
              <span className="text-sm">图片</span>
            </div>
            <div 
              className={`flex flex-row items-center flex-1 justify-center px-8 py-4 cursor-pointer space-x-2 ${selectedSection === 1 ? "border-b-2 border-black" : ''} hover:border-b-2 hover:border-black`} 
              onClick={() => handleSectionClick(1)}
            >
              <BsReverseLayoutTextSidebarReverse className="text-base" />
              <span className="text-sm">文字</span>
            </div>
          </div>
          <div className="w-full">
            <div className="flex flex-wrap gap-2 justify-start">
              {tabs.map((text, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 text-center rounded-full text-xs cursor-pointer outline-none border-2 border-[#2D3648] box-content ${selectedTab === index ? "bg-[#2D3648] text-white" : ""}`}
                  onClick={() => handleTabClick(index)}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
          {selectedSection === 0 && (
            <div className={styles.scroll}>
              <div className={styles.imageContainer}>
                {filterAssets('image').map(asset => (
                  <div key={asset.id} className={styles.imageContainer}>
                    <div className={styles.cardLabelPic}>{asset.tag}</div> 
                    <img 
                      src={`${BASE_URL}/storage/images/${asset.image_id}`}
                      alt={asset.tag}
                      className={styles.image}
                      onClick={() => handleImageClick(`${BASE_URL}/storage/images/${asset.image_id}`)} 
                    />
                  </div>
                ))}  
                <div/>
              </div>
            </div>
          )}
          {selectedSection === 1 && (
            <div className={styles.scroll}>
              <div 
                className={styles.cardContainer}

              >
                {filterAssets('text').map(asset => (
                  <div 
                    key={asset.id} 
                    className={styles.card}
                    onClick={() => handleTextClick(asset.text)} 
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
