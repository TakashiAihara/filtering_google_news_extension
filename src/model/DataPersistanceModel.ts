interface DataPersistanceModel{

	getSavedArticles(): Promise<Article[]>
	saveArticles(articles: Article[]): Promise<boolean>

}
