import {Book} from './book.model';
import {HttpClient} from "@angular/common/http";
import {UserBook} from "../users/user-book.model";
import {NotificationService} from "../notification.service";

export class BooksService {

    constructor(private http: HttpClient,
                private notification: NotificationService) {
    }

    getBook(id: number) {
        return this.http.get<Book>('http://localhost:8080/api/v1/books/' + id);
    }

    saveBook(book: Book, callbackFcn) {
        this.http.post<UserBook>('http://localhost:8080/api/v1/books', book).subscribe({
            next: data => {
                callbackFcn();
            },
            error: error => {
                this.notification.showErrorNotification("There was an error!");
                console.error('There was an error!', error);
            }
        })
    }

    uploadImage(file, book) {
        const formData = new FormData();
        formData.append('file', file);

        this.http.post<any>('http://localhost:8080/api/v1/books/upload', formData,
            {responseType: 'text' as 'json'}).subscribe({
             next: data => {
                 book.image = data;
             },
             error: error => {
                 this.notification.showErrorNotification("There was an error!");
                 console.error('There was an error!', error);
             }
         })
    }

    deleteBook(id: number) {
        return this.http.delete('http://localhost:8080/api/v1/books/' + id)
            .subscribe(() => {
                this.notification.showOKNotification("Deleted successfully!");
                console.log('Delete successful');
            });
    }

    uploadBooks(bookMap) {
        const formData = new FormData();
        Array.from(bookMap.entries()).forEach(value => {
            formData.append("files[]", value[1].epubFile);
            formData.append("images[]", value[1].imageFile);
        });

        this.http.post<any>('http://localhost:8080/api/v1/books/upload-books', formData)
            .subscribe({
                next: data => {
                    console.log("Uploaded books");
                },
                error: error => {
                    this.notification.showErrorNotification("There was an error!");
                    console.error('There was an error!', error);
                }
            })
    }
}
