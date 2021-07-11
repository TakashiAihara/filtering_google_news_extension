import { browser } from "webextension-polyfill-ts";

export class LocalStorageModel implements DataPersistanceModel{

	private static instance: LocalStorageModel;

    properties = {
        storageId: "google_news_articles"
    }

	public async getSavedArticles(): Promise<Article[]>{
        const storageItems = await browser.storage.local.get();
        if (storageItems.items) {
			const parsedObject : Article[] = JSON.parse(storageItems.items[this.properties.storageId]);
            return parsedObject;
		}
		return []
	}

	public async saveArticles(articles: Article[]): Promise<boolean>{
        await browser.storage.local.set({ items: { [this.properties.storageId]: JSON.stringify(articles)}});
		return true;
	}

	private constructor(){}

	public static getInstance() : LocalStorageModel{
        if (!this.instance) {
            this.instance = new LocalStorageModel();
        }
        return this.instance;
    }

}
