"use client";
import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './Quill.module.css';

const modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ 'size': ['small', 'medium', 'large', 'huge'] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'align': [] }],
    [{ 'color': [] }],
    ['clean']
  ],
};

function QuillEditor({ onTextUpdate }: { onTextUpdate: (prev: string, next: string) => void }) {
  const [value, setValue] = useState<string>('');
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    // fetch from localstorage 
    const savedContent = localStorage.getItem('quillContent');
    if (savedContent) {
      setValue(savedContent);
    }

    const handleClickOutside = () => {
      clearHighlight();
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleChange = (content: string) => {
    setValue(content);
    // store into localStorage
    localStorage.setItem('quillContent', content);
  };

  const handleDoubleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    const editor = quillRef.current?.getEditor();
    const selection = window.getSelection();
  
    if (editor && selection) {
      const range = selection.getRangeAt(0);
      const startOffset = range.startOffset;
      const text = editor.getText();
  
      // get the position of your mouse
      const cursorPosition = editor.getSelection().index;
  
      // calculate 200 words 
      const start = Math.max(cursorPosition - 200, 0);
      const end = Math.min(cursorPosition + 200, text.length);
  
      const prev = text.slice(start, cursorPosition);
      const next = text.slice(cursorPosition, end);
  
      // set highlight
      editor.formatText(start, end - start, { background: '#E4EDFC' });
  
      // store previous and next text
      onTextUpdate(prev, next);
    }
  };
  

  const clearHighlight = () => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      editor.formatText(0, editor.getLength(), { background: false });
    }
  };

  return (
    <div className={styles.editorContainer} onDoubleClick={handleDoubleClick}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        className={`flex flex-col h-full flex-grow overflow-y-hidden`}
      />
    </div>
  );
}

export default QuillEditor;
