'use client';
import "@/styles/variable.css";
import React, { useEffect, useState, useRef } from "react";
import Tab from "@/components/section/article/tab/tab";
import Articlehome from "@/components/section/article/homeRecommend/home";
import SearchField from "@/components/common/searchField/SearchField";
import ImageSlider from "@/components/section/article/pagenationCard/pagenationCard";
import TabPage from "@/components/section/article/tabPage/tabPage";
import ArticleCreate from "@/components/section/article/create/ArticleCreate";
import styles from "./article.module.css";
// @ts-ignore
import confetti from "canvas-confetti";
import { useSearchParams } from "next/navigation";

interface Article {
  _id: string;
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  date: string;
  imageUrl?: string;
  description?: string;
}

const TAB_LABELS = ["전체", "UI", "카드뉴스", "포스터", "용어사전", "트렌드"];

export default function ArticleClient() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [, setRCount] = useState(0);
  const rTimeout = useRef<NodeJS.Timeout | null>(null);
  const titleRef = useRef<HTMLSpanElement | null>(null);
  const searchParams = useSearchParams();

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

  useEffect(() => {
    fetch("/api/articles")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((item: any): Article => ({
          _id: item._id,
          title: item.title,
          content: item.content,
          category: item.category,
          date: item.date,
          imageUrl: item.imageUrl ?? "",
          description: item.description ?? "",
          id: item._id,
          slug: item.slug ?? "",
        }));
        setArticles(mapped);
      });
  }, []);

  useEffect(() => {
    if (!searchParams) return;
    const category = searchParams.get("category");
    if (category) {
      const idx = TAB_LABELS.indexOf(category);
      if (idx !== -1) setActiveTab(idx);
    }
  }, [searchParams]);

  const filteredArticles = activeTab === 0
    ? articles
    : articles.filter(article => article.category === TAB_LABELS[activeTab]);

  const handleSearch = () => setSearch(inputValue);

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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div className={styles.container}>
        <button className={styles.button} onClick={() => setActiveTab(0)}>
          <h1 className={styles.title}>
            <span ref={titleRef} onMouseEnter={handleTitleHover} style={{ display: "inline-block" }}>
              Article
            </span>
          </h1>
        </button>
        <SearchField
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onSearch={handleSearch}
        />
        <Tab activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 0 ? (
          <>
            <ImageSlider />
            <Articlehome setActiveTab={setActiveTab} />
          </>
        ) : (
          <TabPage
            tabIdx={activeTab}
            articles={articles.map(article => ({
              id: article._id,
              slug: article.slug ?? "",
              title: article.title,
              content: article.content,
              category: article.category,
              date: article.date,
              imageUrl: article.imageUrl ?? "",
              description: article.description ?? "",
            }))}
            search={search}
          />
        )}
        {activeTab !== 0 && filteredArticles.length === 0 ? (
          <div className={styles.centerMessage}>게시글이 없습니다.</div>
        ) : (
          <ul />
        )}
        {showCreate && (
          <ArticleCreate
            onCreated={() => {
              setShowCreate(false);
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
