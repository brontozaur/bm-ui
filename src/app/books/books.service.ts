import {Book} from './book.model';
import {HttpClient} from "@angular/common/http";
import {UserBook} from "../users/user-book.model";
import {NotificationService} from "../notification.service";
import {Router} from "@angular/router";

export class BooksService {

    constructor(private http: HttpClient,
                private notification: NotificationService,
                private router: Router) {
    }

    getBook(id: number) {
        return this.http.get<Book>('http://localhost:8080/api/v1/books/' + id);
    }

    saveBook(book: Book) {
        this.http.post<UserBook>('http://localhost:8080/api/v1/books', book).subscribe({
            next: data => {
                this.router.navigate(['books']);
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

    uploadBooks(bookMap, metadataMap) {
        const formData = new FormData();
        Array.from(bookMap.entries()).forEach(value => {
            formData.append("files[]", value[1].epubFile);
            formData.append("images[]", value[1].imageFile);
            formData.append("titles[]", value[1].title);
        });

        Array.from(metadataMap.entries()).forEach(value => {
            formData.append("metadatas[]", value[1]);
        });

        this.http.post<any>('http://localhost:8080/api/v1/books/upload-books', formData)
            .subscribe({
                next: data => {
                    this.notification.showOKNotification("Books uploaded!");
                    console.log("Uploaded books");
                    this.router.navigate(['books']);
                },
                error: error => {
                    this.notification.showErrorNotification("There was an error!");
                    console.error('There was an error!', error);
                }
            })
    }

    encryptBooks(booksList, table) {
        var books = [];
        for(var index in booksList) {
            var book = booksList[index]._row.data;
            books.push(book);
        }
        this.http.post<any>('http://localhost:8080/api/v1/books/encrypt', books).subscribe({
            next: data => {
                table.setData();
            },
            error: error => {
                this.notification.showErrorNotification("There was an error!");
                console.error('There was an error!', error);
            }
        })
    }

    downloadEncryptedBook(bookRow) {
        this.http.get('http://localhost:8080/api/v1/books/download/'+ bookRow.id ,{responseType: 'arraybuffer'}
        ).subscribe(response => {
            var downloadLink = document.createElement("a");
            var blob = new Blob([response], { type: 'application/epub'});
            var url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = "encrypted_"+ bookRow.epub;

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    }

    downloadBook(bookRow) {
        this.http.get('http://localhost:8080/api/v1/books/download-original/'+ bookRow.id ,{responseType: 'arraybuffer'}
        ).subscribe(response => {
            var downloadLink = document.createElement("a");
            var blob = new Blob([response], { type: 'application/epub'});
            var url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = bookRow.epub;

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    }
}
