/**
 * Article 含む塊。
 * ベースとなる Div と 1以上の Article を含む。
 */
abstract class Chunk {
	constructor(
		protected baseDiv: Element,
		protected articles: Article[] = []
	) { }

	public scanHasNewsId(newsId: string): boolean {
		return this.articles.some(
			article => {
				return article.hasNewsId(newsId);
			}
		)
	}

	public hasArticles(): boolean {
		return !!this.articles.length
	}

	// physical and logical delete
	public remove(newsId: string): boolean {
		this.removeArticleElement(newsId);
		this.removeArticle(newsId);
		if (this.articles.length === 0) {
			this.baseDiv.remove();
		}
		return true
	}

	// logical delete
	private removeArticle(newsId: string): Article {
		const idx: number = this.findArticleIndex(newsId)
		const temp: Article = this.articles[idx]
		this.articles.splice(this.findArticleIndex(newsId), 1);
		return temp
	}

	// physical delete
	private removeArticleElement(newsId: string): boolean {
		return this.articles.some(
			article => {
				return article.removeElement(newsId);
			}
		)
	}

	private findArticleIndex(newsId: string): number {
		return this.articles.findIndex(
			article => {
				return newsId === article.newsId
			}

		)
	}

}
