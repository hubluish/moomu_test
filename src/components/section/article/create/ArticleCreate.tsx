import React, { useState, FormEvent, ChangeEvent, KeyboardEvent, useRef } from "react";
import styles from "./ArticleList.module.css";
import "@/styles/variable.css";
import Image from "next/image";
import { toSlug } from '@/utils/slug';

const CATEGORY_OPTIONS = ["UI", "카드뉴스", "포스터", "용어사전", "트렌드"];

interface ArticleCreateProps {
  onCreated: () => void;
}

export default function ArticleCreate({ onCreated }: ArticleCreateProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const [content, setContent] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const [isRecommended, setIsRecommended] = useState(false);

  // 파일 선택 시 이미지 미리보기 처리
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = ev => setImageUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 드래그앤드롭으로 이미지 업로드
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = ev => setImageUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 이미지 URL 직접 입력
  const handleImageUrlInput = (e: ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setImageFile(null);
  };

  // 키워드 입력값 변경
  const handleKeywordInput = (e: ChangeEvent<HTMLInputElement>) => {
    setKeywordInput(e.target.value);
  };

  // 엔터로 키워드 추가
  const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      let value = keywordInput.trim();
      if (value.startsWith("#")) value = value.slice(1);
      if (value && !keywords.includes(value)) {
        setKeywords([...keywords, value]);
      }
      setKeywordInput("");
    }
  };

  // 키워드 삭제
  const handleRemoveKeyword = (removeIdx: number) => {
    setKeywords(keywords.filter((_, idx) => idx !== removeIdx));
  };

  // 에디터에 이미지 붙여넣기 지원
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = ev => insertImageAtCursor(ev.target?.result as string);
          reader.readAsDataURL(file);
          e.preventDefault();
        }
      }
    }
  };

  // 커서 위치에 이미지 삽입
  const insertImageAtCursor = (src: string) => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const img = document.createElement("img");
    img.src = src;
    img.style.height = "300px";
    img.style.width = "auto";
    img.style.display = "block";
    range.insertNode(img);
    range.setStartAfter(img);
    range.setEndAfter(img);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  // 에디터 입력 시 내용 저장
  const handleInput = () => {
    const el = contentRef.current;
    if (!el) return;
    setContent(el.innerText);
  };

  // 폼 제출 및 게시글 등록
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let formattedDate = date;
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [y, m, d] = date.split("-");
      formattedDate = `${y.slice(2)}.${m}.${d}`;
    }

    // 에디터 내용을 줄 단위로 파싱하여 HTML 변환
    const htmlRaw = contentRef.current?.innerText || "";
    const lines = htmlRaw.split("\n").map(line => line.trim());
    const html = lines
      .map(line => {
        if (/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i.test(line)) {
          return `<img src="${line}" style="height:300px;width:auto;display:block;" />`;
        }
        if (/^####\s*/.test(line)) {
          return `<div class="markdown-body2">${line.replace(/^####\s*/, "")}</div>`;
        }
        if (/^###\s*/.test(line)) {
          return `<div class="markdown-body1">${line.replace(/^###\s*/, "")}</div>`;
        }
        if (/^##\s*/.test(line)) {
          return `<div class="markdown-title2">${line.replace(/^##\s*/, "")}</div>`;
        }
        if (/^#\s*/.test(line)) {
          return `<div class="markdown-title1">${line.replace(/^#\s*/, "")}</div>`;
        }
        return `<div>${line}</div>`;
      })
      .join("");

    const slug = toSlug(title);

    await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        content: html,
        category,
        date: formattedDate,
        imageUrl,
        description,
        keywords,
        isRecommended,
      }),
    });
    alert("추가되었습니다!");
    onCreated();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* 제목 입력 */}
      <input
        className={styles.input}
        placeholder="제목"
        value={title}
        onChange={e => {
          if (!isComposing) {
            if (e.target.value.length <= 12) setTitle(e.target.value);
            else setTitle(e.target.value.slice(0, 12));
          } else {
            setTitle(e.target.value);
          }
        }}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={e => {
          setIsComposing(false);
          if (e.currentTarget.value.length > 12) {
            setTitle(e.currentTarget.value.slice(0, 12));
          }
        }}
        required
      />
      {/* 카테고리 선택 */}
      <select
        className={styles.input}
        value={category}
        onChange={e => setCategory(e.target.value)}
        required
      >
        {CATEGORY_OPTIONS.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {/* 날짜 입력 */}
      <input
        className={styles.input}
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
      />
      {/* 이미지 업로드 및 URL 입력 */}
      <div
        style={{
          border: "1px dashed #bbb",
          borderRadius: 4,
          padding: 12,
          textAlign: "center",
          marginBottom: 8,
          background: "#fafbfc",
        }}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="image-upload"
          onChange={handleFileChange}
        />
        <label htmlFor="image-upload" style={{ cursor: "pointer" }}>
          이미지 파일을 드래그하거나 클릭해서 선택하세요
        </label>
        <div style={{ margin: "8px 0" }}>또는</div>
        <input
          className={styles.input}
          placeholder="이미지 URL을 입력하세요"
          value={imageFile ? "" : imageUrl}
          onChange={handleImageUrlInput}
        />
        {/* 이미지 미리보기 */}
        {imageUrl && (
          <Image
            width={120}
            height={120}
            src={imageUrl}
            alt="미리보기"
            style={{ display: "block", margin: "8px auto" }}
          />
        )}
      </div>
      {/* 설명 입력 */}
      <input
        className={styles.input}
        placeholder="설명"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      {/* 키워드 입력 */}
      <div style={{ marginBottom: 8 }}>
        <input
          className={styles.input}
          placeholder="#키워드 입력 후 엔터"
          value={keywordInput}
          onChange={handleKeywordInput}
          onKeyDown={handleKeywordKeyDown}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
          {keywords.map((kw, idx) => (
            <span
              key={kw}
              style={{
                background: "#e3e6f0",
                borderRadius: 12,
                padding: "2px 10px",
                marginRight: 4,
                display: "flex",
                alignItems: "center",
                fontSize: 14,
              }}
            >
              #{kw}
              <button
                type="button"
                onClick={() => handleRemoveKeyword(idx)}
                style={{
                  background: "none",
                  border: "none",
                  marginLeft: 4,
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: "#888",
                }}
                aria-label="키워드 삭제"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
      {/* 본문 에디터 */}
      <div style={{ position: "relative" }}>
        {content.trim() === "" && (
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 12,
              color: "var(--color-text-sub)",
              pointerEvents: "none",
              fontFamily: "'Pretendard', sans-serif",
              fontSize: 16,
              zIndex: 1,
            }}
          >
            내용을 입력하세요
          </div>
        )}
        <div
          className={styles.textarea}
          contentEditable
          ref={contentRef}
          onPaste={handlePaste}
          onInput={handleInput}
          style={{
            minHeight: 120,
            border: "1px solid #ddd",
            borderRadius: 4,
            padding: 8,
            fontFamily: "'Pretendard', sans-serif",
            color: "var(--color-text-main)",
            background: "transparent",
            position: "relative",
            zIndex: 2,
          }}
          suppressContentEditableWarning
        />
      </div>
      {/* 추천글 체크박스 */}
      <div style={{ margin: "12px 0" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={isRecommended}
            onChange={e => setIsRecommended(e.target.checked)}
            style={{ width: 18, height: 18 }}
          />
          <span style={{ fontSize: 16 }}>추천글로 등록</span>
        </label>
      </div>
      {/* 등록 버튼 */}
      <button type="submit" className={styles.submit}>등록</button>
    </form>
  );
}