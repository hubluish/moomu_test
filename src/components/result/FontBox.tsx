// ConceptBox.tsx
'use client';

import React, {useEffect, useState} from 'react';

interface FontData {
    font_link: string;
    image_link: string;
    image_alt: string;
}

// fontKeyword props 추가 (string 또는 string[])
interface FontBoxProps {
    fontKeyword: string; // "손글씨 바탕" 등
}

export default function FontBox({ fontKeyword }: FontBoxProps) {
    const [fonts, setFonts] = useState<FontData[]>([]);
    const [page, setPage] = useState(0);
    const fontsPerPage = 3;

    useEffect(() => {
        fetch('/data/noonnu_fonts.json')
        .then(res => res.json())
        .then(data => {
            if (data && data[fontKeyword] && Array.isArray(data[fontKeyword])) {
                setFonts(data[fontKeyword]);
            } else if (data) {
                // 모든 폰트 배열을 합쳐서 image_alt에 키워드가 포함된 것만 필터
                const allFonts = Object.values(data).flat();
                const filtered = allFonts.filter(
                    (font: FontData) => font.image_alt && font.image_alt.includes(fontKeyword)
                );
                setFonts(filtered);
            } else {
                setFonts([]);
            }
        })
        .catch(err => {
            console.error('폰트 데이터 로드 실패:', err);
            setFonts([]);
        });
    }, [fontKeyword]);

    // 3개씩 묶어서 보여주기
    const startIdx = page * fontsPerPage;
    const currentFonts = fonts.slice(startIdx, startIdx + fontsPerPage);
    const hasPrev = page > 0;
    const hasNext = startIdx + fontsPerPage < fonts.length;

    const handleCopy = (link: string) => {
        navigator.clipboard.writeText(link);
        alert('폰트 링크가 복사되었습니다!');
    };

    return (
        <div style={styles.container}>
        <div style={styles.title}>Fonts</div>
        {hasPrev && (
        <button style={{ ...styles.arrow, ...styles.left }} onClick={() => setPage(page - 1)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="40" viewBox="0 0 20 40" fill="none">
                <path opacity="0.25" d="M0 20L17.3077 40L20 36.6667L5.76923 20L20 3.33333L17.3077 0L0 20Z" fill="black" />
            </svg>
            </button>
        )}

        {hasNext && (
            <button style={{ ...styles.arrow, ...styles.right }} onClick={() => setPage(page + 1)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="40" viewBox="0 0 20 40" fill="none">
                <path opacity="0.25" d="M2.69231 0L0 3.33333L14.2308 20L0 36.6667L2.69231 40L20 20L2.69231 0Z" fill="black" />
            </svg>
            </button>
        )}

        <div style={styles.content}>
            {currentFonts.length === 0 ? (
                <div>해당 키워드의 폰트가 없습니다.</div>
            ) : (
                currentFonts.map((font, idx) => (
                    <img
                        key={idx}
                        src={font.image_link}
                        alt={font.image_alt}
                        style={styles.image}
                        onClick={() => handleCopy(font.font_link)}
                    />
                ))
            )}
        </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
    borderRadius: '30px',
    border: '2px solid #E6E8EC',
    background: '#FFF',
    boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.25)',
    width: '384px',
    height: '313px',
    flexShrink: 0,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    },
    title: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: '#000',
    fontFamily: 'Pretendard',
    fontSize: '32px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '15px', // 46.875% of what? This seems off but kept as you specified
    },
    content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    textAlign: 'center',
    padding: '0 24px',
    },
    image: {
    width: '150px',
    height: 'auto',
    cursor: 'pointer',
    borderRadius: '10px',
    },
    arrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    },
    left: {
        left: '0px',
    },
    right: {
        right: '0px',
    },
};
