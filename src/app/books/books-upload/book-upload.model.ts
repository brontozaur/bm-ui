export class BookUpload {
    public title: string;
    public image: string | ArrayBuffer;
    public file: string | ArrayBuffer;

    constructor(title: string,
                image: string,
                file: string) {
        this.title = title;
        this.image = image;
        this.file = file;
    }
}
