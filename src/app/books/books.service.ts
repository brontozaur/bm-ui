import {Book} from './book.model';
import {HttpClient} from "@angular/common/http";
import {UserBook} from "../users/user-book.model";
import {NotificationService} from "../notification.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

export class BooksService {

    constructor(private http: HttpClient,
                private notification: NotificationService,
                private router: Router) {
    }

    getBook(id: number) {
        return this.http.get<Book>(`${environment.apiUrl}/api/v1/books/` + id);
    }

    saveBook(book: Book) {
        this.http.post<UserBook>(`${environment.apiUrl}/api/v1/books`, book).subscribe({
            next: data => {
                this.router.navigate(['books']);
            },
            error: error => {
                this.notification.showErrorNotification(error);
                console.error('There was an error!', error);
            }
        })
    }



    uploadFile(file, book, isImage) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', isImage);

        this.http.post<any>(`${environment.apiUrl}/api/v1/books/upload`, formData,
            {responseType: 'text' as 'json'}).subscribe({
            next: data => {
                if(isImage) {
                    book.image = data;
                } else {
                    book.epub = data;
                }
            },
            error: error => {
                this.notification.showErrorNotification(error);
                console.error('There was an error!', error);
            }
        })
    }

    deleteBook(id: number, callbackFcn: () => void) {
        return this.http.delete(`${environment.apiUrl}/api/v1/books/` + id)
            .subscribe({
                next: data => {
                    callbackFcn();
                    this.notification.showOKNotification("Deleted successfully!");
                    console.log('Delete successful');
                },
                error: error => {
                    this.notification.showErrorNotification(error);
                    console.error('There was an error!', error);
                }
            });
    }

    uploadBooks(bookMap, metadataMap) {
        const formData = new FormData();
        Array.from(bookMap.entries()).forEach(value => {
            formData.append("files[]", value[1].epubFile);
            formData.append("images[]", value[1].imageFile);
            formData.append("titles[]", value[1].epubFile.name);
        });

        Array.from(metadataMap.entries()).forEach(value => {
            formData.append("metadatas[]", value[1]);
        });

        this.http.post<any>(`${environment.apiUrl}/api/v1/books/upload-books`, formData)
            .subscribe({
                next: data => {
                    this.notification.showOKNotification("Books uploaded!");
                    console.log("Uploaded books");
                    this.router.navigate(['books']);
                },
                error: error => {
                    this.notification.showErrorNotification(error);
                    console.error('There was an error!', error);
                }
            })
    }

    encryptBooks(booksList, table) {
        var books = [];
        for (var index in booksList) {
            var book = booksList[index]._row.data;
            books.push(book);
        }
        this.http.post<any>(`${environment.apiUrl}/api/v1/books/encrypt`, books).subscribe({
            next: data => {
                table.setData();
                this.notification.showOKNotification("Books encrypted!");
            },
            error: error => {
                this.notification.showErrorNotification(error);
                console.error('There was an error!', error);
            }
        })
    }

    downloadEncryptedBook(bookRow) {
        this.http.get(`${environment.apiUrl}/api/v1/books/download/` + bookRow.id, {responseType: 'arraybuffer'}
        ).subscribe(response => {
            var downloadLink = document.createElement("a");
            var blob = new Blob([response], {type: 'application/epub'});
            var url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = "encrypted_" + bookRow.epub;

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    }

    downloadBook(bookRow) {
        this.http.get(`${environment.apiUrl}/api/v1/books/download-original/` + bookRow.id, {responseType: 'arraybuffer'}
        ).subscribe(response => {
            var downloadLink = document.createElement("a");
            var blob = new Blob([response], {type: 'application/epub'});
            var url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = bookRow.epub;

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    }
}
