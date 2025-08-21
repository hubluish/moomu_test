"use client";
import { useRef, useState } from "react";
import { kMeansPalette } from "@/lib/color/kmeans";
import { nearestNamedColors } from "@/lib/color/nearest";
import { loadClipImageEncoder, encodeImage } from "@/lib/clip/encodeImage";
import { loadTextBank, topKDistinct } from "@/lib/clip/zeroShot";

type Result = {
  color_keywords: string[];
  font_keywords: string[];
  image_emotion_keywords: string[];
};

export function useImageKeywords() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const encRef = useRef<any>(null);
  const fontRef = useRef<any>(null);
  const moodRef = useRef<any>(null);

  async function ensureBanks() {
    if (!encRef.current) {
      encRef.current = await loadClipImageEncoder("/models/clip-vitb32-image-encoder.onnx");
    }
    if (!fontRef.current) {
      fontRef.current = await loadTextBank("/embeddings/font_labels.json", "/embeddings/font_embeddings.fp32.json");
    }
    if (!moodRef.current) {
      moodRef.current = await loadTextBank("/embeddings/mood_labels.json", "/embeddings/mood_embeddings.fp32.json");
    }
  }

  async function run(file: File) {
    setLoading(true);
    try {
      await ensureBanks();
      const bmp = await createImageBitmap(file);

      // 224x224 (CLIP 인코딩용, center-crop fit)
      const can = document.createElement("canvas");
      can.width = 224; can.height = 224;
      const ctx = can.getContext("2d")!;
      {
        const scale = Math.max(224 / bmp.width, 224 / bmp.height);
        const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
        const ox = Math.round((224 - w) / 2), oy = Math.round((224 - h) / 2);
        ctx.drawImage(bmp, ox, oy, w, h);
      }

      // 256x256 (팔레트 추출용, cover fit)
      const can2 = document.createElement("canvas");
      can2.width = 256; can2.height = 256;
      const ctx2 = can2.getContext("2d")!;
      {
        const scale = Math.max(256 / bmp.width, 256 / bmp.height);
        const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
        const ox = Math.round((256 - w) / 2), oy = Math.round((256 - h) / 2);
        ctx2.drawImage(bmp, ox, oy, w, h);
      }

      // 1) 색상 1~2개
      const imgData = ctx2.getImageData(0, 0, 256, 256);
      const palette = kMeansPalette(imgData, 6, 15, 65536);
      const color_keywords = nearestNamedColors(palette, 2, true);

      // 2) 이미지 임베딩
      const q = await encodeImage(encRef.current, can);

      // 3) 폰트 1~2개
      const font_keywords = topKDistinct(fontRef.current, q, 2);

      // 4) 이미지/감정 2~3개
      const image_emotion_keywords = topKDistinct(moodRef.current, q, 3);

      const out = { color_keywords, font_keywords, image_emotion_keywords };
      setResult(out);
      return out;
    } finally {
      setLoading(false);
    }
  }

  return { loading, result, run };
}
