class DisplayedArticle extends Article{

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
    ) {
        super(title,newsId,newsLink,img,updatedDate,siteName,snippet)
    }

	// physical delete
    removeElement(): boolean;
    removeElement(newsId: string): boolean;
    removeElement(newsId?: string) : boolean{
        if (typeof newsId === "string") {
            if(this.newsId == newsId){
                this.articleElement?.remove()
                return true
            }else{
                return false
            }
        }else if(typeof newsId === "undefined"){
            this.articleElement?.remove()
            return true
        }
        return false
    }

    hasNewsId(newsId: string) : boolean{
        return this.newsId === newsId
    }

}
