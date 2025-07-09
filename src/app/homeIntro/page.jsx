"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./HomeIntro.module.css";
import Header from "@/components/common/header/header";

const images = [
  "/assets/carousel/1.jpg",
  "/assets/carousel/2.jpg",
  "/assets/carousel/3.jpg",
  "/assets/carousel/4.jpg",
  "/assets/carousel/5.jpg",
  "/assets/carousel/6.jpg",
  "/assets/carousel/7.jpg",
  "/assets/carousel/8.jpg",
  "/assets/carousel/9.jpg",
  "/assets/carousel/10.jpg",
];

const VISIBLE_COUNT = 3;
const TRANSITION_SEC = 1; // 더 부드럽게

const HomeIntro = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(1); // 1부터 시작(앞뒤로 복제)
  const [isTransitioning, setIsTransitioning] = useState(true);
  const timerRef = useRef(null);
  const section4Ref = useRef(null);
  const [scrollX, setScrollX] = useState(0);

  // 자동 슬라이드
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => prev + 1);
      setIsTransitioning(true);
    }, 2500); // 2.5초마다 이동
    return () => clearInterval(timerRef.current);
  }, []);

  // transition 끝나고, 진짜 첫/끝에서 순간이동
  useEffect(() => {
    if (!isTransitioning) return;
    if (current === images.length - VISIBLE_COUNT) {
      // 마지막 복제(맨 앞)에서 진짜 첫번째로 점프
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrent(1);
      }, TRANSITION_SEC * 1000);
    } else if (current === 0) {
      // 첫 복제(맨 뒤)에서 진짜 마지막으로 점프
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrent(images.length - VISIBLE_COUNT + 1);
      }, TRANSITION_SEC * 1000);
    } else {
      setIsTransitioning(true);
    }
  }, [current, images.length]);

  // 트랜지션 끄고 점프 후 다시 트랜지션 켜기
  useEffect(() => {
    if (!isTransitioning) {
      setTimeout(() => setIsTransitioning(true), 20);
    }
  }, [isTransitioning]);

  // 원본 + 복사본 배열로 무한 슬라이드 구현
  const sliderImages = [...images, ...images];

  const handleWheel = (e) => {
    const el = section4Ref.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - 1440;
    let next = scrollX + e.deltaY;

    // 1. 이미 scrollX가 0이고, 위로(e.deltaY < 0)일 때만 부모로 이벤트 전달
    if (scrollX === 0 && e.deltaY < 0) {
      // preventDefault 호출하지 않음 → 부모 스크롤 발생
      return;
    }

    // 2. scrollX가 0이 아닌데 위로 스크롤(e.deltaY < 0)이면, scrollX를 0으로 만들고 부모는 막음
    if (next < 0) {
      setScrollX(0);
      e.preventDefault();
      return;
    }

    // 3. maxScroll보다 크면 maxScroll로 고정
    if (next > maxScroll) next = maxScroll;

    setScrollX(next);
    e.preventDefault();
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.contentWrapper}>
        {/* 1-1 내용 1 컨테이너 */}
        <div className={styles.section1}>
          <div className={styles.section1Title}>
            <span className={styles.subText}>누구나 디자인을 쉽게</span>
          </div>
          <div className={styles.logoText}>moomu</div>
          <div className={styles.section1ButtonWrap}>
            <button
              className={styles.moodBtn}
              onClick={() => router.push("/home/home")}
            >
              <span className={styles.moodBtnText}>무드보드 만들기</span>
              <span className={styles.moodBtnIcon}>
                <svg width="20" height="19" viewBox="0 0 20 19" fill="none">
                  <path d="M5 9.5H15M15 9.5L11 5.5M15 9.5L11 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </button>
          </div>
          <hr className={styles.section1Line} />
        </div>

        {/* 1-2 내용 2 컨테이너 : 사진 캐러셀 */}
        <div className={styles.sliderContainer}>
          <div className={styles.sliderTrack}>
            {sliderImages.map((src, idx) => (
              <div className={styles.slide} key={idx}>
                <img src={src} alt={`slide-${idx}`} />
              </div>
            ))}
          </div>
        </div>

        {/* 1-3 내용 3 컨테이너 */}
        <div className={styles.section3}>
          <div className={styles.section3Title}>
            <span>moomu와 함께해야할이유</span>
          </div>
          <div className={styles.section3Content}>
            {/* 여기에 이유 카드 등 추가 */}
            <div className={styles.reasonWrap}>
              {/* 이유 1 */}
              <div className={styles.reason1}>
                <div className={styles.reasonTitleBox}>
                  <span className={styles.reasonTitle}>풍부한 자료</span>
                </div>
                <div className={styles.reasonImg1}>
                  <img
                    src="/pinterest.svg"
                    alt="pinterest"
                    width={260}
                    height={115}
                  />
                </div>
                <div className={styles.reasonText1}>
                  무한한 핀터레스트 기반 이미지,
                  <br />
                  <span className={styles.strongText}>oo한 눈누</span> 기반 폰트,
                  <br />
                  수많은 컬러헌트 기반 색상…
                </div>
              </div>
              {/* 이유 2 */}
              <div className={styles.reason2}>
                <div className={styles.reasonTitleBox}>
                  <span className={styles.reasonTitle}>편리한/쉬운/유용한</span>
                </div>
                <div className={styles.reasonImg2}>
                  <img src="/click.svg" alt="easy" width={83} height={83} />
                </div>
                <div className={styles.reasonText2}>
                  모으고, 정리하고, 저장까지
                  <br />
                  클릭 몇 번이면 끝.
                </div>
              </div>
              {/* 이유 3 */}
              <div className={styles.reason3}>
                <div className={styles.reasonTitleBox}>
                  <span className={styles.reasonTitle}>디자인의 완성까지</span>
                </div>
                <div className={styles.reasonText3}>
                  무드보드를 통해 제작한
                  <br />
                  카드뉴스, UI , 포스터, 아티클 팁까지!
                  <br />
                  예시들을 보며 넘치는 영감을 얻어보세요
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1-4 내용 4 컨테이너 */}
        <div className={styles.section4Wrapper}>
          <div
            className={styles.section4}
            ref={section4Ref}
            style={{ transform: `translate3d(${-scrollX}px, 0, 0)` }}
            tabIndex={0}
            onWheel={handleWheel}
          >
            <div className={styles.section4Item1}>
              <div className={styles.section4Item1Inner}>
                <div className={styles.section4Item1Box1}></div>
                <div className={styles.section4Item1Box2}>
                  <span className={styles.section4Item1Title}>무드보드란?</span>
                </div>
              </div>
              <div className={styles.section4Item1Desc}>
                <span className={styles.section4Item1Point}>
                  폰트, 컨셉, 이미지, 색상
                </span>
                등등
                <br />
                아이디어를 정리하고 보여주는 가장 쉬운 방법이에요.
              </div>
            </div>
            <img
              className={styles.section4Img2}
              src="/home_1.svg"
              alt="section4-2"
            />
            <div className={styles.section4Text3}>
              이미 많은 디자이너들이
              <br />
              이 방법으로 작업을 시작해요!
            </div>
            <div className={styles.section4Item4}>
              <div className={styles.section4Item4Text}>
                디자인을 막 배우기 시작한 사람, 발표 자료를 준비하려는 학생,
                디자인을 추가하고 싶은 개발자, 레퍼런스를 빠르게 정리하고 싶은
                디자이너 .......
              </div>
            </div>
            <div className={styles.section4Item5}>
              <div className={styles.section4Item5Box1}>
                <span className={styles.section4Item5Text1}>디자인 용어를 몰라요</span>
              </div>
              <div className={styles.section4Item5Box2}>
                <span className={styles.section4Item5Text2}>디자인이 처음이에요</span>
              </div>
            </div>
            <img
              className={styles.section4Img6}
              src="/home_2.svg"
              alt="section4-6"
            />
            <div className={styles.section4Text7}>걱정마세요!</div>
            <div className={styles.section4Text8}>
              MOOMU가 가장 빠른 출발점이 되어줄게요
            </div>
            <img
              className={styles.section4Img9}
              src="/home_3.svg"
              alt="section4-9"
            />
          </div>
        </div>

        {/* 1-5 내용 5 컨테이너 */}
        <div className={styles.section5}>
          <div className={styles.section5Logo}>
            <span>moomu</span>
          </div>
          <button className={styles.startBtn} onClick={() => router.push("/home/home")}>
            <div className={styles.startBtnInner}>
              <span className={styles.startBtnText}>지금 바로 시작하기</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeIntro;