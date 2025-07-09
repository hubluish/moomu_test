"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Pagenation from "../../../common/pagenation";
import styles from "./pagenation.module.css";
import Image from "next/image";


const SLUGS = [
  "652b6248eee1811bd0e7bf6ee800408240d2213b5d62de0b94b4a7477ab004c8",
  "8daaff9697228fc9e6c4ff683fa4e3eb5974dfaa5a02b7cc6027dcd7429c8113",
  "5e1a72be79857fa3054f030526a6f4b7e709fbf39bbeaf47a600461d5fa72892",
  "2f8df547dedc0280ebb020bcaf9a47b3bd9051b62f033cc97c0960438bb77e3e"
];

interface SlideData {
  id: string | number;
  imageUrl?: string;
  title1: string;
  title2: string;
  desc1: string;
  desc2: string;
  category: string;
  slug: string;
}

export default function ImageSlider() {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fade, setFade] = useState(true);
  const router = useRouter();

  // 여러 ObjectId로 DB에서 데이터 받아오기
  useEffect(() => {
    Promise.all(
      SLUGS.map((slug) =>
        fetch(`/api/articles?slug=${slug}`)
          .then((res) => res.json())
          .then((data) => {
            if (!data) return null;
            // title, description 2개로 쪼개기
            const titleArr = data.title ? data.title.split(" ") : [""];
            const titleMid = Math.ceil(titleArr.length / 2);
            const title1 = titleArr.slice(0, titleMid).join(" ");
            const title2 = titleArr.slice(titleMid).join(" ");

            const descArr = data.description ? data.description.split(" ") : [""];
            const descMid = Math.ceil(descArr.length / 2);
            const desc1 = descArr.slice(0, descMid).join(" ");
            const desc2 = descArr.slice(descMid).join(" ");

            return {
              id: data.id,
              imageUrl: data.imageUrl,
              title1,
              title2,
              desc1,
              desc2,
              category: data.category,
              slug: data.slug,
            } as SlideData;
          })
          .catch(() => null)
      )
    ).then((results) => {
      setSlides(results.filter((s): s is SlideData => !!s));
    });
  }, []);

  const lastIdx = slides.length - 1;

  // 자동 슬라이드 (2초)
  useEffect(() => {
    if (paused || slides.length === 0) return;
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev === lastIdx ? 0 : prev + 1));
        setFade(true);
      }, 200);
    }, 2000);
    return () => clearInterval(timer);
  }, [lastIdx, paused, slides.length]);

  // 페이지네이션 클릭 시 페이드 인
  const handleChange = (idx: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrent(idx);
      setFade(true);
    }, 200);
  };

  const slide = slides[current];

  // 카드 클릭 시 이동
  const handleCardClick = () => {
    if (slide?.slug) router.push(`/article/${slide.slug}`);
  };

  if (!slide) return null;

  return (
    <div className={styles.frame}>
      <div
        className={styles.imageFrame}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{ overflow: "hidden", position: "relative" }}
        onClick={handleCardClick}
      >
        <div
          className={styles.imageWrap}
          style={{
            opacity: fade ? 1 : 0,
            transition: "opacity 0.3s var(--anim-ease-default)",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          <Image
            src={slide.imageUrl || "/assets/icons/placeholder.png"}
            alt={slide.title1}
            className={styles.image}
            draggable={false}
            width={1200}
            height={400}
            style={{
              userSelect: "none",
              pointerEvents: "none",
              objectFit: "cover",
              borderRadius: "16px",
            }}
          />
          <div className={styles.gradient1} />
          <div className={styles.gradient2} />
          <div className={styles.textFrame}>
            <div className={styles.text1}>
              <div className={styles.text1_1}>{slide.title1}</div>
              <div className={styles.text1_2}>{slide.title2}</div>
            </div>
            <div className={styles.text2}>
              <div className={styles.text2_1}>{slide.desc1}</div>
              <div className={styles.text2_2}>{slide.desc2}</div>
            </div>
          </div>
          {/* 페이지네이션을 이미지 하단 위에 겹치게 */}
          <div className={styles.pagenationOverlay}>
            <Pagenation
              pageCount={slides.length}
              current={current}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}