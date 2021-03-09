export class BookUpload {
    public title: string;
    public mimeType: string;
    public image: string | ArrayBuffer;
    public imageFile: string | object;
    public epubFile: string | object;
    public isCSV: boolean;
    public mapKey: string;

    constructor(title: string,
                mimeType: string,
                image: string,
                imageFile: string,
                epubFile: string,
                isCSV: boolean,
                mapKey: string) {
        this.title = title;
        this.mimeType = mimeType;
        this.image = image;
        this.imageFile = imageFile;
        this.epubFile = epubFile;
        this.isCSV = isCSV;
        this.mapKey = mapKey;
    }
}
