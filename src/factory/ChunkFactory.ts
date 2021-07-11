class ChunkFactory {
    // 加工
    static process(div: Element): Chunk | null {

        if ($(div).is(".y6IFtc")) { // Single Article
            return new SingleArticleChunk(div);
        } else if ($(div).is(".jVwmLb")) { // Has Children Article
            return new CategorizedArticlesChunk(div);
        } else if ($(div).is(".jzZQmc")) { // Categorized Article
            return new HasChildArticlesChunk(div);
        } else { // WTF
            return null;
        }
    }
}
