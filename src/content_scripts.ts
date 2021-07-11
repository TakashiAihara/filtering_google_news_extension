import { browser } from 'webextension-polyfill-ts'
import $ from 'jquery'
import { LocalStorageModel } from './model/LocalStorageModel'


(function init() {
})()

function scanPage() {
    const page = new Page($("div.lBwEZb > div").map(
        (_idx, div) => {
            return ChunkFactory.process(div)
        }).get()
    )
}
// TODO フロントでの処理と、
// TODO クリックされたタイミング
// TODO Factoryパターン

let articleIds: string[] = []


// base
// const baseArticleElement = "article.EjqUne"
// const baseArticleLinkSelector = $(`${baseArticleElement} > a`)

// const childArticleElement = "article.tXImLc"
// const childArticleLinkSelector = $(`${childArticleElement} > a`)

// const coalesceArticleElement = "article.VkAdve"
// const coalesceArticleLinkSelector = $(`${coalesceArticleElement} > a`)

// Articles Parent
// const articlesParentDiv = $('div.lBwEZb')[0]

// const saveArticleId = async function (event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>) {
//     // console.log("saveArticleId")
//     const href = $(event.currentTarget).attr("href")
//     if (href) {
//         const result = /articles\/(.*)\?/.exec(href)
//         if (result) {
//             const articleId = result[1]
//             articleIds.push(articleId)
//             await browser.storage.local.set({ items: { [properties.storageId]: articleIds.join(",") } });
//         }
    // }
// }

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

    scanPage()
    // init article ids
    const model: DataPersistanceModel  = LocalStorageModel.getInstance()
        // hide articles
        // articleIds.slice(0, 500).forEach(articleid => {
        //     hideArticleFromATag($(`a.VDXfz[href*="${articleid}"`));
        // })

        observer.observe(articlesParentDiv, { childList: true, subtree: true })
    })()

    baseArticleLinkSelector.on("click", hideArticle)
    childArticleLinkSelector.on("click", hideArticle)
    coalesceArticleLinkSelector.on("click", hideArticle)

}

execute()
