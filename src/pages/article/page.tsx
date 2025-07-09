// app/article/page.tsx
import { Suspense } from "react";
import ArticleClient from "./ArticleClient";

export default function ArticlePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticleClient />
    </Suspense>
  );
}
