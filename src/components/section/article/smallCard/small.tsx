"use client";
import React from "react";
import styles from "./small.module.css";
import { useRouter } from "next/navigation";


interface ArticleCardProps {
  imageUrl: string;
  title: string;
  description: string;
  category: string;
  date: string;
  slug: string;
}

export default function SmallArticleCard({
  imageUrl,
  title,
  description,
  category,
  date,
  slug,
}: ArticleCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/article/${slug}`);
  };

  return (
    <div className={styles.card} onClick={handleClick} style={{ cursor: "pointer" }}>
      {/* 이미지 */}
      <div
        className={styles.image}
        style={{
          background: `url(${imageUrl}) center/cover, rgba(217, 217, 217, 0.50)`,
        }}
      />
      {/* 텍스트 영역 */}
      <div className={styles.textContainer}>
        {/* 카테고리/날짜 row */}
        <div className={styles.row}>
          <span className={styles.category}>{category}</span>
          <span className={styles.date}>{date}</span>
        </div>
        {/* 제목 */}
        <div className={styles.title}>{title}</div>
        {/* 설명 */}
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
}