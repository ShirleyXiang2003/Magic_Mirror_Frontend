'use client';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function QuillEditor() {
  const [value, setValue] = useState('');

  return <ReactQuill theme="snow" value={value} onChange={(value) => {
    setValue(value);
    console.log('value');
    console.log(value);
  }} onChangeSelection={(sel) => {
    console.log('sel');
    console.log(sel);
    console.log('selected value');
    if (sel) {
      console.log(value.substring(sel.index, sel.index + sel.length));
    }
  }} className='flex flex-col h-full flex-grow overflow-auto' />;
}

export default QuillEditor;