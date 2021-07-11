class Article {

    constructor(
        public title: string = '',
        public newsId: string = '',
        public newsLink: string = '',
        public img: string = '',
        public updatedDate: string = '',
        public siteName: string = '',
        public snippet: string = '',

    ) { }

    hasNewsId(newsId: string) : boolean{
        return this.newsId === newsId
    }

}
