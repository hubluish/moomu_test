"use client";
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import styles from "./big.module.css";
import { useRouter } from "next/navigation";

interface ArticleCardProps {
  id: string | number;
  title: string;
  description: string;
  category: string;
  date: string;
  imageUrl: string;
  onDelete: (id: string | number) => void;
  slug: string;
}

export default function ArticleCard({
  id,
  imageUrl,
  title,
  description,
  category,
  date,
  onDelete,
  slug,
}: ArticleCardProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const qCount = useRef(0);

  // 카드 클릭 시 조회수 증가 후 상세 페이지로 이동
  const handleClick = async () => {
    // 조회수 증가 요청
    await fetch(`/api/articles/${id}`, { method: "POST" });
    // 상세 페이지로 이동
    router.push(`/article/${slug}`);
  };

  // 카드 hover 상태에서 Q를 3번 누르면 게시글 삭제
  useEffect(() => {
    if (!hovered) return;
    const onKeyDown = async (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "q") {
        qCount.current += 1;
        if (qCount.current === 3) {
          // 1. DB에서 삭제
          await axios.delete(`/api/articles/${id}`);
          // 2. UI에서 제거
          onDelete(id);
          qCount.current = 0;
        }
      } else {
        qCount.current = 0;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      qCount.current = 0;
    };
  }, [hovered, id, onDelete]);

  return (
    // 카드 전체 컨테이너 (hover, click 이벤트)
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={styles.card}
    >
      {/* 이미지 컨테이너 */}
      <div className={styles.imageContainer}>
        {/* 이미지 */}
        <div
          className={styles.image}
          style={{
            background: `url(${imageUrl}) center/cover, rgba(217, 217, 217, 0.50)`,
          }}
        >
          {/* 태그 (필요시 내용 추가) */}
          <div className={styles.tag}></div>
        </div>
      </div>
      {/* 텍스트 컨테이너 */}
      <div className={styles.textContainer}>
        {/* 카테고리/날짜 row */}
        <div className={styles.row}>
          <span className={styles.category}>{category}</span>
          <span className={styles.date}>{date}</span>
        </div>
        {/* 타이틀 */}
        <div className={styles.title}>{title}</div>
        {/* 설명 */}
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
}