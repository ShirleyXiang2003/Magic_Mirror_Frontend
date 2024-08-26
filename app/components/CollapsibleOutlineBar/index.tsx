'use client';
import React, { useEffect, useState } from 'react';
import { BsSearch, BsFillCaretDownFill, BsFillCaretRightFill } from 'react-icons/bs';
import styles from './CollapsibleOutlineBar.module.css';

interface Outline {
  标题: string;
  题材: string;
  摘要: string[];
  人物性格: {
    名称: string;
    身份: string;
    性格: Record<string, string>;
  }[];
  关键地点: {
    名称: string;
    描述: string;
    重要事件: string[];
  }[];
  关键物品: {
    名称: string;
    描述: string;
    重要事件: string[];
  }[];
  势力组织: {
    名称: string;
    描述: string;
  }[];
  世界观设定: {
    社会结构: string;
    政体: string;
    种族: string;
    文化: string;
    历史背景: string;
    科技: string;
    魔法: string;
    宗教与信仰: string;
  }[];
}

const CollapsibleOutlineBar: React.FC = () => {
  const [outline, setOutline] = useState<Outline | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCharacterIndex, setExpandedCharacterIndex] = useState<number | null>(null);
  const [expandedLocationIndex, setExpandedLocationIndex] = useState<number | null>(null);
  const [expandedItemIndex, setExpandedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    const storedOutline = localStorage.getItem('outline');
    if (storedOutline) {
      try {
        const parsedOutline = JSON.parse(storedOutline) as Outline;
        setOutline(parsedOutline);
      } catch (error) {
        console.error('Failed to parse outline:', error);
      }
    } else {
      console.error('No outline found');
    }
  }, []);

  const highlightText = (text: string) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  const renderHighlightedText = (text: string) => (
    <span dangerouslySetInnerHTML={{ __html: highlightText(text) }} />
  );

  const handleCharacterToggle = (index: number) => {
    setExpandedCharacterIndex(expandedCharacterIndex === index ? null : index);
  };

  const handleLocationToggle = (index: number) => {
    setExpandedLocationIndex(expandedLocationIndex === index ? null : index);
  };

  const handleItemToggle = (index: number) => {
    setExpandedItemIndex(expandedItemIndex === index ? null : index);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>小说设定</h2>
      <div className={styles.searchContainer}>
        <BsSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="搜索"
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className={styles.content}>
        {outline ? (
          <div>
            <h3 className={styles.subtitle}>标题</h3>
            <p className={styles.summaryItem}>{renderHighlightedText(outline.标题)}</p>

            <h3 className={styles.subtitle}>题材</h3>
            <p className={styles.summaryItem}>{renderHighlightedText(outline.题材)}</p>

            {outline.摘要 && (
              <div>
                <h3 className={styles.subtitle}>摘要</h3>
                <ul className={styles.summaryList}>
                  {outline.摘要.map((item, index) => (
                    <li key={index} className={styles.summaryItem}>
                      <div className={styles.circleContainer}>
                        <div className={styles.largeCircle}></div>
                        <div className={styles.smallCircle}></div>
                        <div className={styles.line}></div>
                      </div>
                      {renderHighlightedText(item)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {outline.人物性格 && (
              <div>
                <h3 className={styles.subtitle}>人物性格</h3>
                <ul className={styles.list}>
                  {outline.人物性格.map((character, index) => (
                    <div key={index} className={styles.listItem}>
                      <div className={styles.frame}>
                        <button
                          className={styles.toggleButton}
                          onClick={() => handleCharacterToggle(index)}
                        >
                          {expandedCharacterIndex === index ? (
                            <BsFillCaretDownFill className={styles.reactIconsBs} color="#126FD6" />
                          ) : (
                            <BsFillCaretRightFill className={styles.reactIconsBs} color="#126FD6" />
                          )}
                        </button>
                        <div className={styles.div}>
                          <div className={styles.character}>
                            {renderHighlightedText(character.名称)}
                          </div>
                          <div className={styles.intro}>
                            {renderHighlightedText(character.身份)}
                          </div>
                        </div>
                      </div>
                      {expandedCharacterIndex === index && (
                        <ul className={styles.list}>
                          {Object.entries(character.性格).map(([trait, description], idx) => (
                            <li key={idx}>
                              {renderHighlightedText(trait)}: {renderHighlightedText(description)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </ul>
              </div>
            )}

            {outline.关键地点 && (
              <div>
                <h3 className={styles.subtitle}>关键地点</h3>
                <ul className={styles.list}>
                  {outline.关键地点.map((location, index) => (
                    <div key={index} className={styles.listItem}>
                      <div className={styles.frame}>
                        <button
                          className={styles.toggleButton}
                          onClick={() => handleLocationToggle(index)}
                        >
                          {expandedLocationIndex === index ? (
                            <BsFillCaretDownFill className={styles.reactIconsBs} color="#126FD6" />
                          ) : (
                            <BsFillCaretRightFill className={styles.reactIconsBs} color="#126FD6" />
                          )}
                        </button>
                        <div className={styles.div}>
                          <div className={styles.character}>
                            {renderHighlightedText(location.名称)}
                          </div>
                        </div>
                      </div>
                      {expandedLocationIndex === index && (
                        <div className={styles.locationDetails}>
                          <p>{renderHighlightedText(location.描述)}</p>
                          <ul className={styles.list}>
                            {location.重要事件.map((event, idx) => (
                              <li key={idx}>{renderHighlightedText(event)}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </ul>
              </div>
            )}

            {outline.关键物品 && (
              <div>
                <h3 className={styles.subtitle}>关键物品</h3>
                <ul className={styles.list}>
                  {outline.关键物品.map((item, index) => (
                    <div key={index} className={styles.listItem}>
                      <div className={styles.frame}>
                        <button
                          className={styles.toggleButton}
                          onClick={() => handleItemToggle(index)}
                        >
                          {expandedItemIndex === index ? (
                            <BsFillCaretDownFill className={styles.reactIconsBs} color="#126FD6" />
                          ) : (
                            <BsFillCaretRightFill className={styles.reactIconsBs} color="#126FD6" />
                          )}
                        </button>
                        <div className={styles.div}>
                          <div className={styles.character}>
                            {renderHighlightedText(item.名称)}
                          </div>
                        </div>
                      </div>
                      {expandedItemIndex === index && (
                        <div className={styles.itemDetails}>
                          <p>{renderHighlightedText(item.描述)}</p>
                          <ul className={styles.list}>
                            {item.重要事件.map((event, idx) => (
                              <li key={idx}>{renderHighlightedText(event)}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </ul>
              </div>
            )}

            {outline.势力组织 && (
              <div>
                <h3 className={styles.subtitle}>势力组织</h3>
                {outline.势力组织.map((faction, index) => (
                  <div key={index} className={styles.detail}>
                    <ul className={styles.list}>
                      <h4 className={styles.smallTitle}>{renderHighlightedText(faction.名称)}</h4>
                      <p>{renderHighlightedText(faction.描述)}</p>
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {outline.世界观设定 && (
              <div>
                <h3 className={styles.subtitle}>世界观设定</h3>
                {outline.世界观设定.map((setting, index) => (
                  <div key={index} className={styles.detail}>
                    <ul className={styles.list}>
                      <li className={styles.smallTitle}>社会结构: {renderHighlightedText(setting.社会结构)}</li>
                      <li className={styles.smallTitle}>政体: {renderHighlightedText(setting.政体)}</li>
                      <li className={styles.smallTitle}>种族: {renderHighlightedText(setting.种族)}</li>
                      <li className={styles.smallTitle}>文化: {renderHighlightedText(setting.文化)}</li>
                      <li className={styles.smallTitle}>历史背景: {renderHighlightedText(setting.历史背景)}</li>
                      <li className={styles.smallTitle}>科技: {renderHighlightedText(setting.科技)}</li>
                      <li className={styles.smallTitle}>魔法: {renderHighlightedText(setting.魔法)}</li>
                      <li className={styles.smallTitle}>宗教与信仰: {renderHighlightedText(setting.宗教与信仰)}</li>
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p>加载中...</p>
        )}
      </div>
    </div>
  );
};

export default CollapsibleOutlineBar;
