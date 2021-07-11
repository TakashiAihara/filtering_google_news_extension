class SingleArticleChunk extends Chunk {

    constructor(baseDiv: Element) {
        super(baseDiv);

        let article = new DisplayedArticle();
        const $baseDiv = $(baseDiv)

        article.articleElement = $baseDiv.find("article")[0];
        article.linkElement = $baseDiv.find("a")[0];

        article.title = $baseDiv.find("h3").text();
        // article.snippet = $baseDiv.find(".xBbh9").text();
        article.siteName = $baseDiv.find(".AVN2gc").text();
        article.newsLink = $baseDiv.find("a").eq(0).attr("href")!;
        article.newsId = article.newsLink && article.newsLink.split("/")[3].split("?")[0];
        article.img = $baseDiv.find("img").attr("src")!;
        article.updatedDate = $baseDiv.find("time").attr("datetime")!;

        this.articles.push(article);
    }
}
