// ConceptBox.tsx
'use client';

import React from 'react';

interface ConceptBoxProps {
    moodSentences: string[];
}

export default function ConceptBox({ moodSentences }: ConceptBoxProps) {
    // moodSentences가 undefined/null이면 빈 배열로 대체
    const safeMoodSentences = Array.isArray(moodSentences) ? moodSentences : [];

    // 3개씩 묶기
    const grouped = [];
    for (let i = 0; i < safeMoodSentences.length; i += 3) {
        grouped.push(safeMoodSentences.slice(i, i + 3));
    }

    return (
        <div style={styles.container}>
            <div style={styles.title}>Concepts</div>
            <div style={styles.content}>
                {grouped.map((group, idx) => (
                    <div key={idx} style={{ marginBottom: 16 }}>
                        {group.map((sentence, i) => (
                            <p key={i} style={styles.text}>- {sentence}</p>
                        ))}
                    </div>
                ))}
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
    gap: '16px',
    textAlign: 'center',
    padding: '0 24px',
    },
    text: {
    fontFamily: 'Pretendard',
    fontSize: '20px',
    color: '#000',
    margin: 0,
    lineHeight: '24px',
    },
};
