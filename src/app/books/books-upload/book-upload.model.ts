export class BookUpload {
    public title: string;
    public image: string | ArrayBuffer;
    public imageFile: string | object;
    public epubFile: string | object;
    public isCSV: boolean;

    constructor(title: string,
                image: string,
                imageFile: string,
                epubFile: string,
                isCSV: boolean) {
        this.title = title;
        this.image = image;
        this.imageFile = imageFile;
        this.epubFile = epubFile;
        this.isCSV = isCSV;
    }
}
