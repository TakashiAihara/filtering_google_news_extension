import { browser } from 'webextension-polyfill-ts'
import $ from 'jquery'

const properties = {
    storageId: "google_news_ids"
}


// TODO ビジネスモデルで分けること
// TODO フロントでの処理と、
// TODO クリックされたタイミング
// TODO Factoryパターン

let articleIds: string[] = []

class ChunkFactory {
    // 加工
    static process(div: Element) {

        if ($(div).is(".y6IFtc")) { // Single Article
            return new SingleArticleChunk(div);
        } else if ($(div).is(".jVwmLb")) { // Has Children Article
            return new CategorizedArticlesChunk(div);
        } else if ($(div).is(".jzZQmc")) { // Categorized Article
            return new HasChildArticlesChunk(div);
        } else { // WTF

        }
    }
}

/** Chunk定義 */

abstract class Chunk {
    constructor(public baseDiv: Element) { }

    /**
     * @description 物理削除
     */
    abstract removeArticleElement(): boolean;

    /**
     * @description 物理削除
     */
    abstract removeArticleElementWithId(newsId: string): boolean;
}

// TODO Chunkを扱う側でChunkの論理削除が必要。

class SingleArticleChunk extends Chunk {

    private article: Article;

    /**
     * @param baseDiv
     */
    constructor(baseDiv: Element) {
        super(baseDiv);

        let article = new Article();
        article.title = $(baseDiv).find("h3").text();
        article.snippet = $(baseDiv).find(".xBbh9").text();
        article.siteName = $(baseDiv).find(".AVN2gc").text();
        article.newsLink = $(baseDiv).find("a").eq(0).attr("href")!;
        article.newsId = article.newsLink && article.newsLink.split("/")[3].split("?")[0];
        article.img = $(baseDiv).find("img").attr("src")!;
        article.updatedDate = $(baseDiv).find("time").attr("datetime")!;
        article.articleElement = $(baseDiv).find("article")[0];
        article.linkElement = $(baseDiv).find("a")[0];

        this.article = article;
    }

    removeArticleElement(): boolean {
        this.article.remove();
        this.baseDiv.remove();
        return true;
    }

    removeArticleElementWithId(newsId: string): boolean {
        return (this.article.newsId !== newsId) || this.removeArticleElement();
    }

}

class CategorizedArticlesChunk extends Chunk {
    // TODO hideArticleメソッドの定義。
    // TODO 持っているarticleすべてのIDを照合する。
    // TODO hideしたらtrueをかえす。

    private categoryName: string = '';
    private articles: Article[] = [];

    /**
     * @param baseDiv
     */
    constructor(baseDiv: Element) {
        super(baseDiv);
        this.categoryName = $(baseDiv).find("h2").text();

        // 分解して詰める
        $(baseDiv).find("article").each((idx, articleElement) => {
            let article = new Article();

            article.title = $(articleElement).find("h3").text();
            article.snippet = $(baseDiv).find(".xBbh9").text();
            article.siteName = $(baseDiv).find(".AVN2gc").text();
            article.newsLink = $(baseDiv).find("a").eq(0).attr("href")!;
            article.newsId = article.newsLink && article.newsLink.split("/")[3].split("?")[0];
            article.img = $(baseDiv).find("img").attr("src")!;
            article.updatedDate = $(baseDiv).find("time").attr("datetime")!;
            article.articleElement = $(baseDiv).find("article")[0];
            article.linkElement = $(baseDiv).find("a")[0];

            this.articles.push(article);
        })

    }

    removeArticleElement(): boolean {
        this.articles.forEach
        this.article.remove();
        this.baseDiv.remove();
        return true;
    }

    removeArticleElementWithId(newsId: string): boolean {
        return (this.article.newsId !== newsId) || this.removeArticleElement();
    }

}


class HasChildArticlesChunk extends Chunk {

    private articles: Article[];

    constructor(baseDiv: Element) {
        super(baseDiv);
        this.articles = null;
    }

}

class Article {
    constructor(
        public title: string = '',
        public newsId: string = '',
        public newsLink: string = '',
        public img: string = '',
        public updatedDate: string = '',
        public siteName: string = '',
        public snippet: string = '',

        public articleElement: Element | null = null,
        public linkElement: Element | null = null,
    ) { }

    remove() {
        this.articleElement?.remove()
    }

}


// base
const baseArticleElement = "article.EjqUne"
const baseArticleLinkSelector = $(`${baseArticleElement} > a`)

const childArticleElement = "article.tXImLc"
const childArticleLinkSelector = $(`${childArticleElement} > a`)

const coalesceArticleElement = "article.VkAdve"
const coalesceArticleLinkSelector = $(`${coalesceArticleElement} > a`)

// Articles Parent
const articlesParentDiv = $('div.lBwEZb')[0]

const saveArticleId = async function (event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>) {
    // console.log("saveArticleId")
    const href = $(event.currentTarget).attr("href")
    if (href) {
        const result = /articles\/(.*)\?/.exec(href)
        if (result) {
            const articleId = result[1]
            articleIds.push(articleId)
            await browser.storage.local.set({ items: { [properties.storageId]: articleIds.join(",") } });
        }
    }
}

const hideArticle = function (event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>) {
    hideArticleFromATag($(event.currentTarget));
    saveArticleId(event);
}

const hideArticleFromATag = function (element: JQuery<HTMLElement>) {
    // for coalesce article
    element.closest('article.VkAdve').hide();
    // for base article
    element.closest('div.y6IFtc').hide();
    element.closest('article.EjqUne').hide();
    // for child Article
    element.closest('div.eeoZZ').hide();
}

const observer = new MutationObserver(records => {

    // hide
    records.forEach(record => {
        articleIds.slice(0, 500).forEach(articleid => {
            hideArticleFromATag($(record.addedNodes[0]).find(`a.VDXfz[href*="${articleid}"`));
        })
        $(record.addedNodes[0]).find("article.EjqUne > a").on("click", hideArticle)
        $(record.addedNodes[0]).find('article.tXImLc > a').on("click", hideArticle)
        $(record.addedNodes[0]).find('article.VkAdve > a').on("click", hideArticle)
    })

    // event assign
})

const execute = async () => {
    (async function init() {
        // init article ids
        const storageItems = await browser.storage.local.get();
        if (storageItems.items) {
            const storageSavedArticleIds = storageItems.items[properties.storageId]
            if (storageSavedArticleIds.length) {
                articleIds = storageSavedArticleIds.split(",");
            }
        }

        // hide articles
        articleIds.slice(0, 500).forEach(articleid => {
            hideArticleFromATag($(`a.VDXfz[href*="${articleid}"`));
        })

        observer.observe(articlesParentDiv, { childList: true, subtree: true })
    })()

    baseArticleLinkSelector.on("click", hideArticle)
    childArticleLinkSelector.on("click", hideArticle)
    coalesceArticleLinkSelector.on("click", hideArticle)

}

execute()
