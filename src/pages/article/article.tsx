"use client";
import "@/styles/variable.css";
import React, { useEffect, useState, useRef } from "react";
import Tab from "@/components/section/article/tab/tab";
import Articlehome from "@/components/section/article/homeRecommend/home";
import SearchField from "@/components/common/searchField/SearchField";
import ImageSlider from "@/components/section/article/pagenationCard/pagenationCard";
import TabPage from "@/components/section/article/tabPage/tabPage";
import ArticleCreate from "@/components/section/article/create/ArticleCreate";
import styles from "./article.module.css";
import confetti from "canvas-confetti";
import { useSearchParams } from "next/navigation";

interface Article {
  _id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  imageUrl?: string;
  description?: string;
}

const TAB_LABELS = ["전체", "UI", "카드뉴스", "포스터", "용어사전", "트렌드"];

export default function Article() {
  const [activeTab, setActiveTab] = useState(0); // 현재 선택된 탭 인덱스
  const [search, setSearch] = useState(""); // 실제 검색어
  const [inputValue, setInputValue] = useState(""); // 검색 입력값
  const [articles, setArticles] = useState<Article[]>([]); // 전체 게시글 목록
  const [showCreate, setShowCreate] = useState(false);
  const [, setRCount] = useState(0);
  const rTimeout = useRef<NodeJS.Timeout | null>(null);
  const titleRef = useRef<HTMLSpanElement | null>(null);
  const searchParams = useSearchParams();

  // Article 텍스트에 마우스 호버 시 콘페티 효과
  const handleTitleHover = () => {
    if (!titleRef.current) return;
    const rect = titleRef.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { x, y },
      shapes: ["circle", "square"],
      startVelocity: 20,
      gravity: 1.5,
    });
  };

  // 게시글 목록 불러오기
  useEffect(() => {
    fetch("/api/articles")
      .then(res => res.json())
      .then(data => setArticles(data));
  }, []);

  // URL 파라미터(category)로 탭 자동 선택
  useEffect(() => {
    if (!searchParams) return;
    const category = searchParams.get("category");
    if (category) {
      const idx = TAB_LABELS.indexOf(category);
      if (idx !== -1) setActiveTab(idx);
    }
  }, [searchParams]);

  // 현재 탭에 해당하는 게시글만 필터링
  const filteredArticles = activeTab === 0
    ? articles
    : articles.filter(article => article.category === TAB_LABELS[activeTab]);

  // 검색 실행 (검색 아이콘 또는 엔터키)
  const handleSearch = () => setSearch(inputValue);

  // R 세 번 누르면 글쓰기 모달 열기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r") {
        setRCount(prev => {
          const next = prev + 1;
          if (next === 3) {
            setShowCreate(true);
            return 0;
          }
          if (rTimeout.current) clearTimeout(rTimeout.current);
          rTimeout.current = setTimeout(() => setRCount(0), 1000);
          return next;
        });
      } else {
        setRCount(0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (rTimeout.current) clearTimeout(rTimeout.current);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div className={styles.container}>
        {/* 상단 Article 타이틀 */}
        <button className={styles.button} onClick={() => setActiveTab(0)}>
          <h1 className={styles.title}>
            <span
              ref={titleRef}
              onMouseEnter={handleTitleHover}
              style={{ display: "inline-block" }}
            >
              Article
            </span>
          </h1>
        </button>
        {/* 검색 입력창 */}
        <SearchField
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onSearch={handleSearch}
        />
        {/* 탭 메뉴 */}
        <Tab activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* 탭별 콘텐츠 */}
        {activeTab === 0 ? (
          <>
            <ImageSlider />
            <Articlehome setActiveTab={setActiveTab} />
          </>
        ) : (
          <TabPage
            tabIdx={activeTab}
            articles={articles.map(article => ({
              ...article,
              id: article._id, // ✅ _id를 id로 바꿔줌
              slug: article.title
                .toLowerCase()
                .replace(/\s+/g, "-") // 공백을 -로
                .replace(/[^\w-]+/g, ""), // 특수문자 제거
              imageUrl: article.imageUrl ?? "",
              description: article.description ?? "",
            }))}
            search={search}
          />

        )}
        {/* 게시글 없을 때 메시지 */}
        {activeTab !== 0 && filteredArticles.length === 0 ? (
          <div className={styles.centerMessage}>게시글이 없습니다.</div>
        ) : (
          <ul />
        )}
        {/* 글쓰기 버튼 및 모달 */}
        {showCreate && (
          <ArticleCreate
            onCreated={() => {
              setShowCreate(false);
              // 새 글 등록 후 목록 새로고침
              fetch("/api/articles")
                .then(res => res.json())
                .then(data => setArticles(data));
            }}
          />
        )}
      </div>
    </div>
  );
}