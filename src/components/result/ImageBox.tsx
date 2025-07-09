'use client';

import React, { useState, useEffect } from 'react';
import styles from './ImageBox.module.css';

interface PinterestItem {
    thumbnail_url: string;
    pin_url: string;
    }

    export default function ImageBox() {
    const [page, setPage] = useState(0);
    const [data, setData] = useState<PinterestItem[]>([]);
    const itemsPerPage = 6;

    useEffect(() => {
        fetch('/data/pinterest_images.json')
        .then(res => res.json())
        .then(setData)
        .catch(err => console.error('Failed to load JSON:', err));
    }, []);

    const handlePrev = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleNext = () => {
        if ((page + 1) * itemsPerPage < data.length) {
        setPage(page + 1);
        }
    };

    const displayedItems = data.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    return (
        <div className={styles.container}>
        <div className={styles.label}>Image Style</div>
        <div className={styles.gridWrapper}>
            <button className={styles.navButton + ' ' + styles.left} onClick={handlePrev}>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="26" viewBox="0 0 13 26" fill="none">
                <path opacity="0.25" d="M0 13L11.25 26L13 23.8333L3.75 13L13 2.16667L11.25 0L0 13Z" fill="black"/>
            </svg>
            </button>

            <div className={styles.grid}>
            {displayedItems.map((item, idx) => (
                <a key={idx} href={item.pin_url} target="_blank" rel="noopener noreferrer" className={styles.imageWrapper}>
                {item.thumbnail_url?.trim() ? (
                <img src={item.thumbnail_url} alt="pinterest thumbnail" className={styles.image} />
                ) : (
                <div className={styles.placeholder} />
                )}
                </a>
            ))}
            </div>

            <button className={styles.navButton + ' ' + styles.right} onClick={handleNext}>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="26" viewBox="0 0 13 26" fill="none">
                <path opacity="0.25" d="M1.75 0L0 2.16667L9.25 13L0 23.8333L1.75 26L13 13L1.75 0Z" fill="black"/>
            </svg>
            </button>
        </div>
        </div>
    );
}
