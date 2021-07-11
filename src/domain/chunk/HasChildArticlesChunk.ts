// in progress
class HasChildArticlesChunk extends Chunk {

    constructor(baseDiv: Element) {
        super(baseDiv);

        $(baseDiv).find("article").each((idx, articleElement) => {
            let article = new DisplayedArticle();
			const $articleElement = $(articleElement)

            article.articleElement = articleElement
            article.linkElement = $articleElement.find("a")[0];

            article.title = $articleElement.find("h3,h4").text();
            // article.snippet = $(baseDiv).find(".xBbh9").text();
            article.siteName = $articleElement.find(".AVN2gc").text();
            article.newsLink = $articleElement.find("a").eq(0).attr("href")!;
            article.newsId = article.newsLink && article.newsLink.split("/")[3].split("?")[0];
            article.img = $articleElement.find("img").attr("src")!;
            article.updatedDate = $articleElement.find("time").attr("datetime")!;

            this.articles.push(article);
        })

    }

}
