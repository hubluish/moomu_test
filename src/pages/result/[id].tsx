import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import FontBox from '../../components/result/FontBox';
import ColorPaletteBox from '../../components/result/ColorPaletteBox';
import ConceptBox from '../../components/result/ConceptBox';
import styles from './result.module.css';
import MoodboardTitle from '../../components/result/MoodboardTitle';
import Chips from '../../components/result/Chips';
import ActionButtons from '../../components/result/ActionButtons';
import ImageBox from '../../components/result/ImageBox';
import React from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResultPage() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('moodboard_results')
        .select('*')
        .eq('id', id)
        .single();
      if (error) setError(error.message);
      else setData(data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!data) return <div>데이터가 없습니다.</div>;

  return (
    <main>
    <MoodboardTitle />
    <div className={styles.topWrapper}>
        <div className={styles.chips}>
            <Chips tags={data.color_keyword || []} />
        </div>
        <div className={styles.actionsWrapper}>
            <div className={styles.actions}>
                <ActionButtons />
            </div>
        </div>
    </div>
    <div className={styles.gridContainer}>
        <div className={styles.conceptBox}>
          <ConceptBox moodSentences={data.mood_sentence} />
        </div>
        <div className={styles.fontBox}>
          <FontBox fontKeyword={data.font_keyword} />
        </div>
        <div className={styles.imageBox}>
            <ImageBox />
        </div>
        <div className={styles.paletteBox}>
          <ColorPaletteBox colorKeywords={data.color_keyword} />
        </div>
    </div>
    </main>
  );
}