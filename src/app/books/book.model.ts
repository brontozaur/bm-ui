import {Author} from '../authors/author.model';

export class Book {
    public id: number;
    public title: string;
    public authors: Author[];
    public isbn: string;
    public year: number;
    public category: string;
    public description: string | ArrayBuffer;
    public image: string | ArrayBuffer;
    public status: string;
    public createdAt: Date;
    public createdBy: string;
    public updatedAt: Date;
    public updatedBy: string;

    constructor(id: number,
                title: string,
                authors: Author[],
                isbn: string,
                year: number,
                category: string,
                description: string | ArrayBuffer,
                image: string | ArrayBuffer,
                status: string,
                createdAt: Date,
                createdBy: string,
                updatedAt: Date,
                updatedBy: string) {
        this.id = id;
        this.title = title;
        this.authors = authors;
        this.isbn = isbn;
        this.year = year;
        this.category = category;
        this.description = description;
        this.image = image;
        this.status = status;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy;
    }
}
