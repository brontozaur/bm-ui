export class BookUpload {
    public title: string;
    public image: string | ArrayBuffer;
    public imageFile: string | object;
    public epubFile: string | object;

    constructor(title: string,
                image: string,
                imageFile: string,
                epubFile: string) {
        this.title = title;
        this.image = image;
        this.imageFile = imageFile;
        this.epubFile = epubFile;
    }
}
