'use client';

import React, { useEffect, useState } from 'react';
import styles from './ColorPaletteBox.module.css';
import { getPaletteById } from '@/utils/index.js';

interface ColorPaletteBoxProps {
    colorKeywords: string[];
}

export default function ColorPaletteBox({ colorKeywords }: ColorPaletteBoxProps) {
    const [hexCodes, setHexCodes] = useState<string[][]>([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        async function fetchPalettes() {
            const allHexCodes: string[][] = [];
            const safeKeywords = Array.isArray(colorKeywords) ? colorKeywords : [];
            for (const keyword of safeKeywords) {
                try {
                    const fileName = `/data/colorhunt_colors/${encodeURIComponent(keyword.toLowerCase())}.json`;
                    const res = await fetch(fileName);
                    if (!res.ok) continue;
                    const palettes = await res.json();
                    if (!Array.isArray(palettes) || palettes.length === 0) continue;

                    // palettes는 id string 배열임
                    for (const paletteId of palettes) {
                        const paletteData = getPaletteById(paletteId);
                        if (!paletteData) continue;
                        const codes = [];
                        for (let i = 0; i < 24; i += 6) {
                            const hex = paletteData.code.slice(i, i + 6);
                            if (hex.length === 6) codes.push(`#${hex}`);
                        }
                        allHexCodes.push(codes);
                    }
                } catch (e) {
                    console.error(`Error fetching palette for ${keyword}:`, e);
                    continue;
                }
            }
            setHexCodes(allHexCodes);
            setPage(0); // 키워드 바뀌면 첫 페이지로
        }
        fetchPalettes();
    }, [colorKeywords]);

    const handleCopy = (hex: string) => {
        navigator.clipboard.writeText(hex);
        alert(`${hex}가 복사되었습니다!`);
    };

    const hasPrev = page > 0;
    const hasNext = page < hexCodes.length - 1;

    return (
        <div className={styles.container}>
            <div className={styles.title}>Color Palette</div>
            <div className={styles.content} style={{ position: 'relative' }}>
                {hexCodes.length === 0 ? (
                    <div>팔레트가 없습니다.</div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {hasPrev && (
                            <button
                                style={{ marginRight: 12, background: 'none', border: 'none', cursor: 'pointer', fontSize: 24 }}
                                onClick={() => setPage(page - 1)}
                                aria-label="이전 팔레트"
                            >
                                &lt;
                            </button>
                        )}
                        <div style={{ display: 'flex', marginBottom: 8 }}>
                            {hexCodes[page].map((hex, i) => (
                                <div
                                    key={hex}
                                    className={styles.colorBlock}
                                    style={{ backgroundColor: hex, cursor: 'pointer' }}
                                    onClick={() => handleCopy(hex)}
                                >
                                    <span className={styles.colorCode}>{hex}</span>
                                </div>
                            ))}
                        </div>
                        {hasNext && (
                            <button
                                style={{ marginLeft: 12, background: 'none', border: 'none', cursor: 'pointer', fontSize: 24 }}
                                onClick={() => setPage(page + 1)}
                                aria-label="다음 팔레트"
                            >
                                &gt;
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
