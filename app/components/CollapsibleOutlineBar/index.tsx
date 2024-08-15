'use client';
import React from 'react';
import { BsSearch } from 'react-icons/bs';
import styles from './CollapsibleOutlineBar.module.css';

function CollapsibleOutlineBar() {
    return (
        <div className="flex flex-col p-4">
            <h2 className="text-lg mb-4 text-center">小说设定</h2>
            <div className="relative mb-4">
                <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
                <input
                    type="text"
                    placeholder="搜索"
                    className="w-full py-2 px-10 border border-transparent bg-[#EDF0F7] rounded-full focus:outline-none text-sm"
                />
            </div>
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
}

export default CollapsibleOutlineBar;
