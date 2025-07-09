import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";
import { toSlug } from '@/utils/slug'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', 
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 슬러그로 단일 조회
  if (req.method === "GET" && req.query.slug) {
    const { data, error } = await supabase
      .from("article")
      .select("*")
      .eq("slug", req.query.slug)
      .single();
    if (error || !data) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(data);
  }

  // 목록 조회
  if (req.method === "GET") {
    const { category, limit } = req.query;
    let query = supabase.from("article").select("*").order("date", { ascending: false });
    if (category) query = query.eq("category", category);
    if (limit) query = query.limit(Number(limit));
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // 생성
  if (req.method === "POST") {
    const { title, content, category, date, imageUrl, description, keywords } = req.body;
    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "title이 비어있거나 잘못된 값입니다." });
    }
    const slug = toSlug(title);
    const { data, error } = await supabase.from("article").insert([
      {
        title,
        slug,
        content,
        category,
        date,
        imageUrl,
        description,
        keywords,
        views: 0,
        isRecommended: false,
      },
    ]).select();
    if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json({ insertedId: (data as any)?.[0]?.id });
  }

  res.status(405).json({ error: "Method Not Allowed" });
}

