import React from "react";
import Image from 'next/image';
import styles from "./MoodOption.module.css";

type MoodOptionProps = {
  title: string;
  subtitle: string;
  keyName?: string;
  isSelected?: boolean;
  onClick?: () => void;
  step?: number;
};

export default function MoodOption({
  title,
  subtitle,
  keyName,
  isSelected,
  onClick,
  step,
}: MoodOptionProps) {
  const folder = step === 3 ? "font" : "image";
  const imageUrl = `/data/images/${folder}/${keyName}.jpg`;

  return (
    <div
      className={`${styles.container} ${isSelected ? styles.selected : ""}`}
      onClick={onClick}
    >
      <div className={styles.imageArea}>
        <Image src={imageUrl} alt={title} className={styles.image} width={200} height={200} />
      </div>

      <div className={styles.textArea}>
        <div
          className={`${styles.title} ${isSelected ? styles.selectedText : ""}`}
        >
          {title}
        </div>
        <div
          className={`${styles.subtitle} ${
            isSelected ? styles.selectedText : ""
          }`}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
}
