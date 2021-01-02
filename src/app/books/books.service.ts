import {Book} from './book.model';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserBook} from "../users/user-book.model";

export class BooksService {

    constructor(private http: HttpClient) {}

    getBook(id: number) {
        return this.http.get<Book>('http://localhost:8080/api/v1/books/' + id);
    }

    saveBook(book: Book, callbackFcn) {
        this.http.post<UserBook>('http://localhost:8080/api/v1/books', book).subscribe({
            next: data => {
                callbackFcn();
            },
            error: error => {
                console.error('There was an error!', error);
            }
        })
    }

    uploadImage(file, book) {
        const formData = new FormData();
        formData.append('file', file);

        this.http.post<any>('http://localhost:8080/api/v1/books/upload', formData, {responseType: 'text'}).subscribe({
            next: data => {
                book.image = data;
            },
            error: error => {
                console.error('There was an error!', error);
            }
        })
    }

    deleteBook(id: number) {
        return this.http.delete('http://localhost:8080/api/v1/books/' + id)
            .subscribe(() => {console.log('Delete successful');});
    }

    uploadBooks(bookMap) {
        const formData = new FormData();
        Array.from(bookMap.entries()).forEach(value => {
            formData.append("images", value[1].file);
        });

        this.http.post<any>('http://localhost:8080/api/v1/books/upload-books', formData,
            {
                headers: {'Content-Type': undefined}
            }).subscribe({
            next: data => {
                console.log("fffee");
            },
            error: error => {
                console.error('There was an error!', error);
            }
        })
    }
}
