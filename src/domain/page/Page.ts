class Page {
    constructor(private _chunks: Chunk[] = []) { }

    public setChunk(chunk: Chunk): boolean {
        this._chunks.push(chunk);
        return true;
    }

	public removeArticle(newsId: string){
		const idx = this.findHasNewsIdChunkIndex(newsId)
		if(idx){
			this._chunks[idx].remove(newsId)
			if(!this._chunks[idx].hasArticles()){
				this._chunks.splice(idx,1)
			}
			return true
		}else{
			return false
		}
	}

	private findHasNewsIdChunkIndex(newsId: string): number{
		return this._chunks.findIndex(
			chunk => chunk.scanHasNewsId(newsId)
		)
	}
}
