"use client";
import ArticleTab from "@/components/section/article/bigCard/big";
import ArticleTabs from "@/components/section/article/smallCard/small";
import styles from "@/components/section/article/homeRecommend/home.module.css";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

interface CardData {
  imageUrl: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  id: string | number;
}

interface SectionProps {
  title: string;
  imageUrl: string;
  bigCard: CardData;
  smallCards: CardData[];
  onMoreClick: () => void;
}

// 추천 섹션 컴포넌트
function Section({ title, imageUrl, bigCard, smallCards, onMoreClick }: SectionProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  // 더보기 버튼 호버 애니메이션
  const handleMouseEnter = () => {
    gsap.to(btnRef.current, { scale: 1.08, duration: 0.18, ease: "power1.out" });
  };
  const handleMouseLeave = () => {
    gsap.to(btnRef.current, { scale: 1, duration: 0.18, ease: "power1.in" });
  };

  // 더보기 버튼 클릭 시 콜백 실행
  const handleClick = () => {
    if (onMoreClick) onMoreClick();
  };

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <div className={styles.text1Container}>
          <div className={styles.title}>{title}</div>
          <button
            className={styles.button}
            ref={btnRef}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className={styles.buttonText}>더보기</div>
          </button>
        </div>
        <h2 className={styles.sub}>
          Browse through a collection of trending design resources.
        </h2>
      </div>
      <div className={styles.container2}>
        <Image
          src={imageUrl}
          alt="추천 이미지"
          width={510}
          height={400}
          style={{
            marginRight: "8px",
            verticalAlign: "middle",
          }}
        />
        <div className={styles.row}>
          <ArticleTab {...bigCard} onDelete={() => {}} />
          <div className={styles.col}>
            {smallCards.map((card: CardData, idx: number) => (
              <ArticleTabs key={idx} {...card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ArticlehomeProps {
  setActiveTab: (idx: number) => void;
}

// 홈 추천 아티클 섹션 컴포넌트
export default function Articlehome({ setActiveTab }: ArticlehomeProps) {
  const [dictArticles, setDictArticles] = useState<CardData[]>([]);
  const [trendArticles, setTrendArticles] = useState<CardData[]>([]);

  // 용어사전/트렌드 최신글 불러오기
  useEffect(() => {
    fetch("/api/articles?category=용어사전&limit=4")
      .then(res => res.json())
      .then(data => setDictArticles(data));
    fetch("/api/articles?category=트렌드&limit=4")
      .then(res => res.json())
      .then(data => setTrendArticles(data));
  }, []);

  return (
    <div className={styles.container}>
      <Section
        title="디자인 용어 사전 ✒️"
        imageUrl="https://i.pinimg.com/736x/5b/ae/c4/5baec48bdac5e5f23a3f91aeaab1166b.jpg"
        bigCard={dictArticles[0] || {
          imageUrl: "",
          title: "",
          description: "",
          category: "",
          date: "",
        }}
        smallCards={dictArticles.slice(1, 4)}
        onMoreClick={() => setActiveTab(4)}
      />
      <div className={styles.line} />
      <Section
        title="트렌드 탐험대 🔍 "
        imageUrl="https://i.pinimg.com/736x/9c/19/d1/9c19d1cc03ca1ebfd8507afdb483b272.jpg"
        bigCard={trendArticles[0] || {
          imageUrl: "",
          title: "",
          description: "",
          category: "",
          date: "",
        }}
        smallCards={trendArticles.slice(1, 4)}
        onMoreClick={() => setActiveTab(5)}
      />
    </div>
  );
}